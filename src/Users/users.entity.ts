import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { UserRole } from 'src/untils/enums';
import { Exclude } from 'class-transformer';
import { CURRENT_TIMESTAMP } from 'src/untils/constants';
import { Token } from 'src/Token/token.entity';


@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  userName!: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Exclude()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role!: UserRole;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive!: boolean;

   @Column({ type: 'json', nullable: true })
  OTP?: { OTPCode: string; expireDate: Date } | null;

  @Column({ type: 'int', default: 0 })
  OTPSentTimes!: number

@OneToOne(() => Token, (token) => token.user)
token!: Token;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt!: Date;
}