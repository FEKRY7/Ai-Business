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
import { MessageService } from './messages.service';
import { CreateMessageDto } from './dtos/create-messages.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('/api/messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  // GET:/api/messages/:conversationId/messages
  @Get(':conversationId/messages')
  @ApiOperation({
    summary: 'Get all messages of a conversation',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Conversation ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiOkResponse({
    description: 'Messages retrieved successfully.',
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
  async getMessagesByConversation(
    @Param('conversationId') conversationId: string,
  ) {
    return this.messageService.getMessagesByConversation(
      conversationId,
    );
  }

  // GET:/api/messages/:conversationId/messages/:messageId
  @Get(':conversationId/messages/:messageId')
  @ApiOperation({
    summary: 'Get message by ID',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Conversation ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiParam({
    name: 'messageId',
    description: 'Message ID',
    example: '7d6e5c4b-3a2f-1b0c-9d8e-7f6a5b4c3d2e',
  })
  @ApiOkResponse({
    description: 'Message retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Message not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async getMessageById(
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.messageService.getMessageById(
      conversationId,
      messageId,
    );
  }

  // POST:/api/messages/:conversationId/messages
  @Post(':conversationId/messages')
  @ApiOperation({
    summary: 'Create a new message',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Conversation ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiCreatedResponse({
    description: 'Message created successfully.',
  })
  @ApiBadRequestResponse({
  description:
    'Cannot add message to a closed conversation or a conversation currently handled by a human.',
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
  async createMessage(
    @Param('conversationId') conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messageService.create(
      conversationId,
      createMessageDto,
    );
  }

  // PATCH:/api/messages/:conversationId/messages/:messageId
  @Patch(':conversationId/messages/:messageId')
  @ApiOperation({
    summary: 'Update message',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Conversation ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiParam({
    name: 'messageId',
    description: 'Message ID',
    example: '7d6e5c4b-3a2f-1b0c-9d8e-7f6a5b4c3d2e',
  })
  @ApiOkResponse({
    description: 'Message updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Message not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async updateMessage(
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messageService.updateMessage(
      conversationId,
      messageId,
      updateMessageDto,
    );
  }

  // DELETE:/api/messages/:conversationId/messages/:messageId
  @Delete(':conversationId/messages/:messageId')
  @ApiOperation({
    summary: 'Delete message',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Conversation ID',
    example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
  })
  @ApiParam({
    name: 'messageId',
    description: 'Message ID',
    example: '7d6e5c4b-3a2f-1b0c-9d8e-7f6a5b4c3d2e',
  })
  @ApiOkResponse({
    description: 'Message deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Message not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource.',
  })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(AuthRolesGuard)
  async deleteMessage(
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.messageService.deleteMessage(
      conversationId,
      messageId,
    );
  }


  @Post(':conversationId/messages/human')
@ApiOperation({
  summary: 'Send human agent message',
})
@ApiParam({
  name: 'conversationId',
  description: 'Conversation ID',
  example: '0c0d1c3b-4f7f-4d5d-a6d5-0f3a2d4b9e22',
})
@ApiCreatedResponse({
  description: 'Human message created successfully.',
})
@ApiBadRequestResponse({
  description: 'Conversation is not handled by human.',
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
async createHumanMessage(
  @Param('conversationId') conversationId: string,
  @Body() createMessageDto: CreateMessageDto,
) {
  return this.messageService.createHumanMessage(
    conversationId,
    createMessageDto,
  );
}
}