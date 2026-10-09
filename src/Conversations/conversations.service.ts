import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversations.entity';
import { CreateConversationDto } from './dtos/create-conversations.dto';
import { UpdateConversationDto } from './dtos/update-conversations.dto';

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
    ) { }

    async create(
        createConversationDto: CreateConversationDto,
    ): Promise<Conversation> {
        const { customerName, phone, status } = createConversationDto;

        const exists = await this.conversationRepository.findOne({
            where: {
                phone,
                status,
            },
        });

        if (exists) {
            throw new BadRequestException(
                'An active conversation already exists for this customer.',
            );
        }

        const conversation = this.conversationRepository.create({
            customerName,
            phone,
            status,
        });

        return await this.conversationRepository.save(conversation);
    }

    async getAllConversations(): Promise<Conversation[]> {
        return await this.conversationRepository.find({
              relations: {
                messages: true,
              },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async getConversationById(id: string): Promise<Conversation> {
        const conversation = await this.conversationRepository.findOne({
            where: {
                id,
            },
              relations: {
                messages: true,
              },
        });

        if (!conversation) {
            throw new NotFoundException('Conversation not found.');
        }

        return conversation;
    }

    async updateConversation(
        id: string,
        updateConversationDto: UpdateConversationDto,
    ): Promise<Conversation> {
        const conversation = await this.conversationRepository.findOne({
            where: {
                id,
            },
        });

        if (!conversation) {
            throw new NotFoundException('Conversation not found.');
        }

        if (updateConversationDto.customerName !== undefined) {
            conversation.customerName = updateConversationDto.customerName;
        }

        if (updateConversationDto.phone !== undefined) {
            conversation.phone = updateConversationDto.phone;
        }

        if (updateConversationDto.status !== undefined) {
            conversation.status = updateConversationDto.status;
        }

        return await this.conversationRepository.save(conversation);
    }

    async deleteConversation(
        id: string,
    ): Promise<{ message: string }> {
        const conversation = await this.conversationRepository.findOne({
            where: {
                id,
            },
        });

        if (!conversation) {
            throw new NotFoundException('Conversation not found.');
        }

        await this.conversationRepository.remove(conversation);

        return {
            message: 'Conversation deleted successfully.',
        };
    }
}