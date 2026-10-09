import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsString()
  @Length(2, 150)
  @IsOptional()
  userName?: string;

  @IsString()
  @Length(8, 15)
  @IsOptional()
  phone?: string;
}
