import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class GenerateAiDto {
  @ApiProperty({
    example: 'How much does the service cost?',
    description: 'The prompt sent to the AI',
  })
  @IsString({
    message: 'Prompt must be a string.',
  })
  @IsNotEmpty({
    message: 'Prompt is required.',
  })
  @MaxLength(2000, {
    message: 'Prompt must not exceed 2000 characters.',
  })
  prompt!: string;
}