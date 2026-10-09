import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Service } from 'src/Services/services.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from 'src/Faq/faq.entity';
import { Message } from 'src/Messages/messages.entity';
import { Conversation } from 'src/Conversations/conversations.entity';
import { ConversationStatus } from 'src/untils/enums';

@Injectable()
export class AiService {
  constructor(
    private readonly httpService: HttpService,

    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) { }

  // 1
  // async generate(prompt: string): Promise<string> {
  //   const response = await firstValueFrom(
  //     this.httpService.post(
  //       'http://localhost:11434/api/generate',
  //       {
  //         model: 'llama3.2',
  //         prompt,
  //         stream: false,
  //       },
  //     ),
  //   );

  //   return response.data.response;
  // }

  // 2
  async generate(
    conversationId: string,
    prompt: string,
  ): Promise<string> {

    // 1️⃣ Check conversation
    const conversation =
      await this.conversationRepository.findOne({
        where: {
          id: conversationId,
        },
      });

    if (!conversation) {
      throw new NotFoundException(
        'Conversation not found.',
      );
    }

    // 2️⃣ Check if customer message matches a Service
    const matchingService =
      await this.findMatchingService(prompt);

    if (matchingService) {
      const servicePrompt = `
You are a professional customer service AI assistant.

The customer is asking about this service:

Service Name: ${matchingService.name}
Description: ${matchingService.description}
Price: ${matchingService.price}
Duration: ${matchingService.duration ?? 'N/A'}
Category: ${matchingService.category?.name ?? 'N/A'}

CUSTOMER MESSAGE:
${prompt}

RULES:

1. Answer the customer's question using ONLY the service information provided above.
2. Do not invent any information.
3. Do not change the price.
4. Do not change the duration.
5. If the customer asks about the price, give the exact price.
6. If the customer asks about the duration, give the exact duration.
7. If the customer asks generally about the service, briefly explain the service.
8. Answer in the same language as the customer.
9. Be polite and concise.
10. Do not mention the database, Ollama, AI, or internal system.
11. Return only the answer to the customer.

YOUR ANSWER:
`;

      try {
        const response =
          await firstValueFrom(
            this.httpService.post(
              'http://127.0.0.1:11434/api/generate',
              {
                model: 'llama3.2',
                prompt: servicePrompt,
                stream: false,
              },
            ),
          );

        return response.data.response.trim();

      } catch (error) {
        console.error(
          '========== SERVICE AI ERROR ==========',
        );

        console.error(
          error.response?.data ||
          error.message,
        );

        console.error(
          '=====================================',
        );

        throw error;
      }
    }

    // 3️⃣ Check if customer message matches an FAQ
    const matchingFaq =
      await this.findMatchingFaq(prompt);

    if (matchingFaq) {
      return matchingFaq.answer;
    }

    // 4️⃣ Get conversation history
    const messages =
      await this.messageRepository.find({
        where: {
          conversation: {
            id: conversationId,
          },
        },
        order: {
          createdAt: 'ASC',
        },
      });

    // 5️⃣ Get active FAQs
    const faqs =
      await this.faqRepository.find({
        where: {
          isActive: true,
        },
      });

    // 6️⃣ Get Services
    const services =
      await this.serviceRepository.find({
        relations: {
          category: true,
        },
      });

    // 7️⃣ Format conversation history
    const conversationHistory =
      messages
        .map(
          (message) =>
            `${message.role}: ${message.content}`,
        )
        .join('\n');

    // 8️⃣ Format FAQs
    const faqContext =
      faqs
        .map(
          (faq) =>
            `Question: ${faq.question}\nAnswer: ${faq.answer}`,
        )
        .join('\n\n');

    // 9️⃣ Format Services
    const serviceContext =
      services
        .map(
          (service) =>
            `Service: ${service.name}
Description: ${service.description}
Price: ${service.price}
Duration: ${service.duration}
Category: ${service.category?.name ?? 'N/A'}`,
        )
        .join('\n\n');

    // 🔟 Build AI prompt
    const aiPrompt = `
You are a professional customer service AI assistant.

Your job is to answer customer questions using ONLY the information
provided in the FAQ and SERVICES sections.

CONVERSATION HISTORY:
${conversationHistory}

AVAILABLE FAQs:
${faqContext}

AVAILABLE SERVICES:
${serviceContext}

CURRENT CUSTOMER MESSAGE:
${prompt}

RULES:

1. Do not invent information.
2. Do not guess prices.
3. Do not make up services.
4. Use FAQ and service information when relevant.
5. Consider conversation history.
6. Answer in the same language as the customer.
7. Be polite and concise.
8. If the information is available, answer the customer normally.
9. If the information is NOT available, return ONLY:
HUMAN
10. Do not mention FAQs, database, PostgreSQL, or Ollama.
11. Return only the answer or HUMAN.

Now answer the customer's message.
`;

    // 1️⃣1️⃣ Send request to Ollama
try {
  const response =
    await firstValueFrom(
      this.httpService.post(
        'http://127.0.0.1:11434/api/generate',
        {
          model: 'llama3.2',
          prompt: aiPrompt,
          stream: false,
        },
      ),
    );

  const aiResponse =
    response.data.response.trim();

  if (aiResponse === 'HUMAN') {
    conversation.status =
      ConversationStatus.HUMAN;

    await this.conversationRepository.save(
      conversation,
    );

    return 'Please wait, a customer service representative will assist you shortly.';
  }

  return aiResponse;

} catch (error) {
  console.error(
    '========== OLLAMA ERROR ==========',
  );

  console.error(
    error.response?.data ||
    error.message,
  );

  console.error(
    '==================================',
  );

  throw error;
}
  }


  async findMatchingService(
    prompt: string,
  ): Promise<Service | null> {
    const services = await this.serviceRepository.find({
      where: {
        isActive: true,
      },
      relations: {
        category: true,
      },
    });

    if (!services.length) {
      return null;
    }

    const serviceContext = services
      .map(
        (service) =>
          `ID: ${service.id}
Name: ${service.name}
Description: ${service.description}
Price: ${service.price}
Duration: ${service.duration ?? 'Not specified'}
Category: ${service.category?.name ?? 'Not specified'}`,
      )
      .join('\n\n');

    const matchingPrompt = `
You are a service matching assistant.

Your job is ONLY to determine whether the customer's message
matches one of the available services.

AVAILABLE SERVICES:

${serviceContext}

CUSTOMER MESSAGE:
${prompt}

RULES:

- Return ONLY the Service ID if there is a clear match.
- If there is no clear match, return ONLY:
NONE
- Do not answer the customer's question.
- Do not explain anything.
- Do not invent a Service ID.

YOUR RESPONSE:
`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'http://127.0.0.1:11434/api/generate',
          {
            model: 'llama3.2',
            prompt: matchingPrompt,
            stream: false,
          },
        ),
      );

      const result = response.data.response.trim();

      if (result === 'NONE') {
        return null;
      }

      const service = services.find(
        (service) => service.id === result,
      );

      return service ?? null;
    } catch (error) {
      console.error(
        'SERVICE MATCHING ERROR:',
        error.response?.data || error.message,
      );

      return null;
    }
  }

  async findMatchingFaq(
    prompt: string,
  ): Promise<Faq | null> {
    console.log('🔥 findMatchingFaq CALLED');
    console.log('🔥 PROMPT:', prompt);

    const faqs = await this.faqRepository.find();

    console.log('🔥 ALL FAQS:', faqs);

    if (!faqs.length) {
      return null;
    }

    // Give each FAQ a simple number
    const faqContext = faqs
      .map(
        (faq, index) =>
          `FAQ ${index + 1}:
Question: ${faq.question}
Answer: ${faq.answer}`,
      )
      .join('\n\n');

    const matchingPrompt = `
You are an FAQ matching assistant.

Your ONLY job is to determine whether the customer's message
clearly matches one of the available FAQs.

AVAILABLE FAQs:

${faqContext}

CUSTOMER MESSAGE:
${prompt}

RULES:

- Match an FAQ ONLY if the customer's message is clearly asking
  about the same topic or intent as the FAQ question.
- Do NOT choose an FAQ just because the message contains words
  such as "service", "price", or "information".
- If the customer's message is about a different service,
  topic, or request, return:
NONE
- If you are not sure whether there is a match, return:
NONE
- If one FAQ clearly matches, return ONLY its number.
- Return ONLY a number such as:
1
2
3
- Do not answer the customer.
- Do not explain.
- Do not return any other text.

YOUR RESPONSE:
`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'http://127.0.0.1:11434/api/generate',
          {
            model: 'llama3.2',
            prompt: matchingPrompt,
            stream: false,
          },
        ),
      );

      const result =
        response.data.response.trim();

      console.log('================================');
      console.log('CUSTOMER:', prompt);
      console.log('OLLAMA RESULT:', result);
      console.log('================================');

      if (result === 'NONE') {
        return null;
      }

      console.log(
        'CUSTOMER:',
        prompt,
      );

      console.log(
        'FAQ MATCH RESULT:',
        result,
      );

      const index =
        Number(result) - 1;

      if (
        Number.isNaN(index) ||
        index < 0 ||
        index >= faqs.length
      ) {
        return null;
      }

      return faqs[index];

    } catch (error) {

      console.error(
        '========== FAQ MATCHING ERROR ==========',
      );

      console.error(
        error.response?.data ||
        error.message,
      );

      console.error(
        '========================================',
      );

      return null;
    }
  }



}









