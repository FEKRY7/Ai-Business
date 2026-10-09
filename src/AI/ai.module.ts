import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { Service } from 'src/Services/services.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from 'src/Faq/faq.entity';
import { Conversation } from 'src/Conversations/conversations.entity';
import { Message } from 'src/Messages/messages.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Faq,
      Service,
      Message,
      Conversation,
    ]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}