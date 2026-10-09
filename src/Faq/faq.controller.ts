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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiParam,
} from '@nestjs/swagger';

import { UserRole } from 'src/untils/enums';
import { AuthRolesGuard } from 'src/guards/auth.roles.guard';
import { Roles } from 'src/Users/decorators/user-role.decorator';

import { FaqService } from './faq.service';
import { CreateFaqDto } from './dtos/create-faq.dto';
import { UpdateFaqDto } from './dtos/update-faq.dto';

@ApiTags('FAQ')
@ApiBearerAuth()
@Controller('/api/faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // GET: /api/faq
  @Get()
  @ApiOperation({
    summary: 'Get all FAQs',
  })
  @ApiOkResponse({
    description: 'FAQs retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async getAllFaq() {
    return this.faqService.getAllFaqs();
  }

  // GET: /api/faq/:id
  @Get(':id')
  @ApiOperation({
    summary: 'Get FAQ by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'FAQ ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiOkResponse({
    description: 'FAQ retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'FAQ not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async getFaqById(@Param('id') id: string) {
    return this.faqService.getFaqById(id);
  }

  // POST: /api/faq
  @Post()
  @ApiOperation({
    summary: 'Create a new FAQ',
  })
  @ApiCreatedResponse({
    description: 'FAQ created successfully.',
  })
  @ApiBadRequestResponse({
    description: 'FAQ already exists.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async createFaq(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  // PATCH: /api/faq/:id
  @Patch(':id')
  @ApiOperation({
    summary: 'Update FAQ',
  })
  @ApiParam({
    name: 'id',
    description: 'FAQ ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiOkResponse({
    description: 'FAQ updated successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Question already exists.',
  })
  @ApiNotFoundResponse({
    description: 'FAQ not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async updateFaq(
    @Param('id') id: string,
    @Body() updateFaqDto: UpdateFaqDto,
  ) {
    return this.faqService.updateFaq(id, updateFaqDto);
  }

  // DELETE: /api/faq/:id
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete FAQ',
  })
  @ApiParam({
    name: 'id',
    description: 'FAQ ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiOkResponse({
    description: 'FAQ deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'FAQ not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async deleteFaq(@Param('id') id: string) {
    return this.faqService.deleteFaq(id);
  }
}