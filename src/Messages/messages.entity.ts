import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MessageRole } from 'src/untils/enums';
import { Conversation } from 'src/Conversations/conversations.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  content!: string;

  @Column({
    type: 'enum',
    enum: MessageRole,
  })
  role!: MessageRole;

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.messages,
    {
      onDelete: 'CASCADE',
    },
  )
  conversation!: Conversation;

  @CreateDateColumn()
  createdAt!: Date;
}