import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ConversationStatus } from 'src/untils/enums';

export class UpdateConversationDto {
  @ApiProperty({
    example: 'Ahmed Mohamed',
    description: 'Customer name',
  })
  @IsString({ message: 'Customer name must be a string.' })
  @IsOptional({ message: 'Customer name is required.' })
  @MaxLength(100, {
    message: 'Customer name must not exceed 100 characters.',
  })
  customerName?: string;

  @ApiProperty({
    example: '+201012345678',
    description: 'Customer phone number',
  })
  @IsPhoneNumber('EG', {
    message: 'Invalid Egyptian phone number.',
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    enum: ConversationStatus,
    required: false,
    example: ConversationStatus.OPEN,
    description: 'Conversation status',
  })
  @IsOptional()
  @IsEnum(ConversationStatus, {
    message: 'Invalid conversation status.',
  })
  status?: ConversationStatus = ConversationStatus.OPEN;
}