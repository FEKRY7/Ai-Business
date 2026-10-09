import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    MinLength,
    MaxLength,
} from 'class-validator';
import { UserRole } from 'src/untils/enums';

export class RegisterDto {

    @IsString()
    @Length(2, 100)
    @IsNotEmpty()
    userName!: string;

    @IsEmail()
    @MaxLength(250)
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    password!: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
