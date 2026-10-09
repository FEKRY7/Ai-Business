import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateMessageDto {
  @ApiPropertyOptional({
    example: 'How much does the service cost?',
    description: 'Updated message content',
  })
  @IsOptional()
  @IsString({
    message: 'Content must be a string.',
  })
  @IsNotEmpty({
    message: 'Content cannot be empty.',
  })
  content?: string;
}