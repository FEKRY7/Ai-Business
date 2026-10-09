import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/Users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Conversation } from './conversations.entity';
import { ConversationService } from './conversations.service';
import { ConversationController } from './conversations.controller';


@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    forwardRef(() => UsersModule),
    JwtModule,
  ],
})
export class ConversationModule {}