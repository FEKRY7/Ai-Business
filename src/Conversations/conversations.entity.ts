import { Message } from 'src/Messages/messages.entity';
import { ConversationStatus } from 'src/untils/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  customerName!: string;

  @Column({ length: 20 })
  phone!: string;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.OPEN,
  })
  status!: ConversationStatus;

  @OneToMany(
    () => Message,
    (message) => message.conversation,
    {
      cascade: true,
    },
  )
  messages!: Message[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


