import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './faq.entity';
import { UpdateFaqDto } from './dtos/update-faq.dto';
import { CreateFaqDto } from './dtos/create-faq.dto';

@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(Faq)
        private readonly faqRepository: Repository<Faq>,
    ) { }

    async create(createFaqDto: CreateFaqDto): Promise<Faq> {
    const { question, answer, isActive } = createFaqDto;

    const faqExists = await this.faqRepository.findOne({
      where: {
        question,
      },
    });

    if (faqExists) {
      throw new BadRequestException('FAQ already exists');
    }

    const faq = this.faqRepository.create({
      question,
      answer,
      isActive,
    });

    return await this.faqRepository.save(faq);
  }

  async getAllFaqs(): Promise<Faq[]> {
    return await this.faqRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getFaqById(id: string): Promise<Faq> {
    const faq = await this.faqRepository.findOne({
      where: {
        id,
      },
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    return faq;
  }

  async updateFaq(
    id: string,
    updateFaqDto: UpdateFaqDto,
  ): Promise<Faq> {
    const faq = await this.faqRepository.findOne({
      where: {
        id,
      },
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    if (updateFaqDto.question !== undefined) {
      const exists = await this.faqRepository.findOne({
        where: {
          question: updateFaqDto.question,
        },
      });

      if (exists && exists.id !== id) {
        throw new BadRequestException('Question already exists');
      }

      faq.question = updateFaqDto.question;
    }

    if (updateFaqDto.answer !== undefined) {
      faq.answer = updateFaqDto.answer;
    }

    if (updateFaqDto.isActive !== undefined) {
      faq.isActive = updateFaqDto.isActive;
    }

    return await this.faqRepository.save(faq);
  }

  async deleteFaq(id: string): Promise<{ message: string }> {
    const faq = await this.faqRepository.findOne({
      where: {
        id,
      },
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    await this.faqRepository.remove(faq);

    return {
      message: 'FAQ deleted successfully',
    };
  }

}