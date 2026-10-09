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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserRole } from 'src/untils/enums';
import { AuthRolesGuard } from 'src/guards/auth.roles.guard';
import { Roles } from 'src/Users/decorators/user-role.decorator';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dtos/create-services.dto';
import { UpdateServiceDto } from './dtos/update-services.dto';
import { Service } from './services.entity';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('/api/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // POST: /api/services/:categoryId
  @Post(':categoryId')
  @ApiOperation({
    summary: 'Create a new service',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'Category UUID',
    example: '70fb8ee7-544e-44b3-bb78-28d976557a8e',
  })
  @ApiCreatedResponse({
    description: 'Service created successfully.',
    type: Service,
  })
  @ApiBadRequestResponse({
    description: 'Service already exists or validation failed.',
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
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  create(
    @Body() createServiceDto: CreateServiceDto,
    @Param('categoryId') categoryId: string,
  ) {
    return this.servicesService.create(
      createServiceDto,
      categoryId,
    );
  }

  // GET: /api/services
  @Get()
  @ApiOperation({
    summary: 'Get all services',
  })
  @ApiOkResponse({
    description: 'Services retrieved successfully.',
    type: [Service],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  getAllServices() {
    return this.servicesService.getAllServices();
  }

  // GET: /api/services/:id
  @Get(':id')
  @ApiOperation({
    summary: 'Get service by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Service UUID',
    example: '70fb8ee7-544e-44b3-bb78-28d976557a8e',
  })
  @ApiOkResponse({
    description: 'Service retrieved successfully.',
    type: Service,
  })
  @ApiNotFoundResponse({
    description: 'Service not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  getServiceById(@Param('id') id: string) {
    return this.servicesService.getServiceById(id);
  }

  // PATCH: /api/services/:id
  @Patch(':id')
  @ApiOperation({
    summary: 'Update service',
  })
  @ApiParam({
    name: 'id',
    description: 'Service UUID',
    example: '70fb8ee7-544e-44b3-bb78-28d976557a8e',
  })
  @ApiOkResponse({
    description: 'Service updated successfully.',
    type: Service,
  })
  @ApiBadRequestResponse({
    description: 'Slug already exists or validation failed.',
  })
  @ApiNotFoundResponse({
    description: 'Service or category not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.updateService(
      id,
      updateServiceDto,
    );
  }

  // DELETE: /api/services/:id
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete service',
  })
  @ApiParam({
    name: 'id',
    description: 'Service UUID',
    example: '70fb8ee7-544e-44b3-bb78-28d976557a8e',
  })
  @ApiOkResponse({
    description: 'Service deleted successfully.',
    schema: {
      example: {
        message: 'Service deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Service not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  deleteService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }
}