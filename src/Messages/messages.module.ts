import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Users/users.entity';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { UsersModule } from 'src/Users/users.module';
import { Conversation } from 'src/Conversations/conversations.entity';
import { Message } from './messages.entity';
import { MessageService } from './messages.service';
import { MessageController } from './messages.controller';
import { AiModule } from 'src/AI/ai.module';


@Module({
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
  imports: [
    TypeOrmModule.forFeature([Message,Conversation]),
    JwtModule,
    UsersModule,
    AiModule,
  ],
})
export class MessageModule {}