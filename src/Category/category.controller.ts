import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './category.entity';
import { Roles } from 'src/Users/decorators/user-role.decorator';
import { AuthRolesGuard } from 'src/guards/auth.roles.guard';
import { UserRole } from 'src/untils/enums';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('/api/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  // POST: /api/category
  @Post()
  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiCreatedResponse({
    description: 'Category created successfully.',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: 'Category already exists or validation failed.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  // GET: /api/category
  @Get()
  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiOkResponse({
    description: 'Categories retrieved successfully.',
    type: [Category],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAllCategories();
  }

  // GET: /api/category/:id
  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Category UUID',
    example: '70fb8ee7-544e-44b3-bb78-28d976557a8e',
  })
  @ApiOkResponse({
    description: 'Category retrieved successfully.',
    type: Category,
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getCategoryById(
    @Param('id') id: string,
  ): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  // PATCH: /api/category/:id
  @Patch(':id')
  @ApiOperation({
    summary: 'Update category',
  })
  @ApiParam({
    name: 'id',
    description: 'Category UUID',
    example: '70fb8ee7-544e-44b3-bb78-28d976557a8e',
  })
  @ApiOkResponse({
    description: 'Category updated successfully.',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: 'Slug already exists or validation failed.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(
      id,
      updateCategoryDto,
    );
  }

  // DELETE: /api/category/:id
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete category',
  })
  @ApiParam({
    name: 'id',
    description: 'Category UUID',
    example: '70fb8ee7-544e-44b3-bb78-28d976557a8e',
  })
  @ApiOkResponse({
    description: 'Category deleted successfully.',
    schema: {
      example: {
        message: 'Category deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async deleteCategory(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.categoryService.deleteCategory(id);
  }
}