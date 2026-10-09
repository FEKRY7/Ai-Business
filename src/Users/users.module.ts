import {
  ClassSerializerInterceptor,
  Module,
} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthProvider } from './auth.provider';
import { Token } from 'src/Token/token.entity';
import { OtpService } from './otpGenerator.provider';
import { MailModule } from 'src/mail/mail.module';


@Module({
  controllers: [UsersController],
  exports: [UsersService,OtpService,AuthProvider],
  imports: [
    TypeOrmModule.forFeature([User, Token]), // Registers User entity
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }), 
    MailModule,
  ],  
  providers: [
    UsersService,
    AuthProvider,
    OtpService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, // Applies serialization globally
    },
  ],
})
export class UsersModule { }