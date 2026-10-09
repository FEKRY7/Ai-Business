import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateFaqDto {

  @IsString()
  @IsOptional()
  @MaxLength(255)
  question?: string;

  @IsString()
  @IsOptional()
  answer?: string;


  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

