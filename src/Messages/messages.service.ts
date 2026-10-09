import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './messages.entity';
import { Conversation } from 'src/Conversations/conversations.entity';
import { CreateMessageDto } from './dtos/create-messages.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { AiService } from 'src/AI/ai.service';
import { ConversationStatus, MessageRole } from 'src/untils/enums';


@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,

        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,

        private readonly aiService: AiService,
    ) { }

    // Create Message
    // async create(
    //     conversationId: string,
    //     createMessageDto: CreateMessageDto,
    // ): Promise<Message> {
    //     const { content, role } = createMessageDto;

    //     const conversation =
    //         await this.conversationRepository.findOne({
    //             where: {
    //                 id: conversationId,
    //             },
    //         });

    //     if (!conversation) {
    //         throw new NotFoundException(
    //             'Conversation not found.',
    //         );
    //     }

    //     if (conversation.status === 'CLOSED') {
    //         throw new BadRequestException(
    //             'Cannot add message to a closed conversation.',
    //         );
    //     }

    //     const message = this.messageRepository.create({
    //         content,
    //         role,
    //         conversation,
    //     });

    //     return await this.messageRepository.save(message);
    // }

    async create(
        conversationId: string,
        createMessageDto: CreateMessageDto,
    ): Promise<Message[]> {
        const { content } = createMessageDto;

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

        if (conversation.status === ConversationStatus.CLOSED) {
            throw new BadRequestException(
                'Cannot add message to a closed conversation.',
            );
        }

        if (conversation.status === ConversationStatus.HUMAN) {
            throw new BadRequestException(
                'This conversation is currently handled by a human agent.',
            );
        }

        // 1️⃣ Create USER message
        const userMessage =
            this.messageRepository.create({
                content,
                role: MessageRole.USER,
                conversation,
            });

        const savedUserMessage =
            await this.messageRepository.save(
                userMessage,
            );

        // 2️⃣ Generate AI response
        const aiResponse =
            await this.aiService.generate(
                conversationId,
                content,
            );

        // 3️⃣ Create ASSISTANT message
        const assistantMessage =
            this.messageRepository.create({
                content: aiResponse,
                role: MessageRole.ASSISTANT,
                conversation,
            });

        const savedAssistantMessage =
            await this.messageRepository.save(
                assistantMessage,
            );

        return [
            savedUserMessage,
            savedAssistantMessage,
        ];
    }

    async createHumanMessage(
    conversationId: string,
    createMessageDto: CreateMessageDto,
): Promise<Message> {
    const { content } = createMessageDto;

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

    if (
        conversation.status !==
        ConversationStatus.HUMAN
    ) {
        throw new BadRequestException(
            'This conversation is not handled by a human agent.',
        );
    }

    const humanMessage =
        this.messageRepository.create({
            content,
            role: MessageRole.HUMAN,
            conversation,
        });

    return await this.messageRepository.save(
        humanMessage,
    );
}

    // Get all messages of a conversation
    async getMessagesByConversation(
        conversationId: string,
    ): Promise<Message[]> {
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

        return await this.messageRepository.find({
            where: {
                conversation: {
                    id: conversationId,
                },
            },
            order: {
                createdAt: 'ASC',
            },
        });
    }

    // Get Message by ID
    async getMessageById(
        conversationId: string,
        messageId: string,
    ): Promise<Message> {
        const message = await this.messageRepository.findOne({
            where: {
                id: messageId,
                conversation: {
                    id: conversationId,
                },
            },
            relations: {
                conversation: true,
            },
        });

        if (!message) {
            throw new NotFoundException(
                'Message not found.',
            );
        }

        return message;
    }

    // Update Message
    async updateMessage(
        conversationId: string,
        messageId: string,
        updateMessageDto: UpdateMessageDto,
    ): Promise<Message> {
        const message = await this.messageRepository.findOne({
            where: {
                id: messageId,
                conversation: {
                    id: conversationId,
                },
            },
        });

        if (!message) {
            throw new NotFoundException(
                'Message not found.',
            );
        }

        if (updateMessageDto.content !== undefined) {
            message.content = updateMessageDto.content;
        }

        return await this.messageRepository.save(message);
    }

    // Delete Message
    async deleteMessage(
        conversationId: string,
        messageId: string,
    ): Promise<{ message: string }> {
        const message = await this.messageRepository.findOne({
            where: {
                id: messageId,
                conversation: {
                    id: conversationId,
                },
            },
        });

        if (!message) {
            throw new NotFoundException(
                'Message not found.',
            );
        }

        await this.messageRepository.remove(message);

        return {
            message: 'Message deleted successfully.',
        };
    }
}