// import {
//   IsBoolean,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   MaxLength,
// } from 'class-validator';

// export class CreateFaqDto {

//   @IsString()
//   @IsNotEmpty()
//   @MaxLength(255)
//   question!: string;

//   @IsString()
//   @IsNotEmpty()
//   answer!: string;


//   @IsBoolean()
//   @IsOptional()
//   isActive?: boolean = true;
// }



import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({
    example: 'Is the service free?',
    description: 'Customer question',
  })
  @IsString({ message: 'Question must be a string.' })
  @IsNotEmpty({ message: 'Question is required.' })
  @MaxLength(255, {
    message: 'Question must not exceed 255 characters.',
  })
  question!: string;

  @ApiProperty({
    example: 'No, this is a paid service. Prices start from EGP 500.',
    description: 'Answer to the customer question',
  })
  @IsString({ message: 'Answer must be a string.' })
  @IsNotEmpty({ message: 'Answer is required.' })
  answer!: string;

  @ApiProperty({
    example: true,
    required: false,
    default: true,
    description: 'FAQ status',
  })
  @IsOptional()
  @IsBoolean({
    message: 'isActive must be a boolean value.',
  })
  isActive?: boolean;
}