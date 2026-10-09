import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/Users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './services.entity';
import { Category } from 'src/Category/category.entity';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
  imports: [
    TypeOrmModule.forFeature([Service, Category]),
    UsersModule,
    JwtModule,
  ],
})
export class ServicesModule {}