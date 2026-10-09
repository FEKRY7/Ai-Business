import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import slugify from 'slugify';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  public async create(createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;

    // 🔗 generate slug
    const slug = slugify(name, { lower: true, strict: true });

    // 🔍 check slug unique
    const exists = await this.categoryRepository.findOne({
      where: { slug },
    });

    if (exists) {
      throw new BadRequestException('Category already exists');
    }

    // ✅ create category
    const category = this.categoryRepository.create({
      name,
      slug,
      description,
    });

    return await this.categoryRepository.save(category);
  }


  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // 📝 update name + slug
    if (updateCategoryDto.name !== undefined) {
      const slug = slugify(updateCategoryDto.name, {
        lower: true,
        strict: true,
      });

      // check slug unique
      const slugExists = await this.categoryRepository.findOne({
        where: { slug },
      });

      if (slugExists && slugExists.id !== id) {
        throw new BadRequestException('Slug already exists');
      }

      category.name = updateCategoryDto.name;
      category.slug = slug;
    }

    if (updateCategoryDto.description !== undefined) {
      category.description = updateCategoryDto.description;
    }


    return await this.categoryRepository.save(category);
  }

  // ✅ Get all categories
  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ Get category by id
  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        services: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // ✅ Delete category
  async deleteCategory(id: string): Promise<{ message: string }> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.remove(category);

    return { message: 'Category deleted successfully' };
  }

}