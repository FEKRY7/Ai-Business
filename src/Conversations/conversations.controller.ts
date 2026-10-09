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

import { AuthRolesGuard } from 'src/guards/auth.roles.guard';
import { Roles } from 'src/Users/decorators/user-role.decorator';
import { UserRole } from 'src/untils/enums';
import { ConversationService } from './conversations.service';
import { CreateConversationDto } from './dtos/create-conversations.dto';
import { UpdateConversationDto } from './dtos/update-conversations.dto';

@ApiTags('Conversations')
@ApiBearerAuth()
@Controller('/api/conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
  ) { }

  // GET: /api/conversations
  @Get()
  @ApiOperation({ summary: 'Get all conversations' })
  @ApiOkResponse({
    description: 'Conversations retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async getAllConversations() {
    return this.conversationService.getAllConversations();
  }

  // GET: /api/conversations/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiOkResponse({
    description: 'Conversation retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Conversation not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async getConversationById(
    @Param('id') id: string,
  ) {
    return this.conversationService.getConversationById(id);
  }

  // POST: /api/conversations
  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiCreatedResponse({
    description: 'Conversation created successfully.',
  })
  @ApiBadRequestResponse({
    description:
      'An active conversation already exists for this customer.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.conversationService.create(createConversationDto);
  }

  // PATCH: /api/conversations/:id
  @Patch(':id')
  @ApiOperation({ summary: 'Update conversation' })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiOkResponse({
    description: 'Conversation updated successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid conversation data.',
  })
  @ApiNotFoundResponse({
    description: 'Conversation not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async updateConversation(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.updateConversation(
      id,
      updateConversationDto,
    );
  }

  // DELETE: /api/conversations/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Delete conversation' })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiOkResponse({
    description: 'Conversation deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Conversation not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async deleteConversation(
    @Param('id') id: string,
  ) {
    return this.conversationService.deleteConversation(id);
  }
}