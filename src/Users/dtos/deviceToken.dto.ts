import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateDeviceTokenDto {

  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsOptional()
  type?: string;
}
