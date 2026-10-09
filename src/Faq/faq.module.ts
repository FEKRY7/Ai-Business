import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/Users/users.module';
import { Faq } from './faq.entity';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';


@Module({
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
  imports: [
    TypeOrmModule.forFeature([Faq]),
    JwtModule,
    UsersModule,
  ],
})
export class FaqModule {}