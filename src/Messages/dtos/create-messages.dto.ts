import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'How much does the service cost?',
    description: 'Message content',
  })
  @IsString({
    message: 'Content must be a string.',
  })
  @IsNotEmpty({
    message: 'Content is required.',
  })
  content!: string;
}