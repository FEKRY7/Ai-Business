import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/Users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Service } from 'src/Services/services.entity';


@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
  imports: [
    TypeOrmModule.forFeature([
        Category,
        Service
    ]),
    forwardRef(() => UsersModule),
    JwtModule,
  ],
})
export class CategorysModule {}