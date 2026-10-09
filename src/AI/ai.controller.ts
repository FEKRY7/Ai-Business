import {
    Body,
    Controller,
    Param,
    Post,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { AiService } from './ai.service';
import { GenerateAiDto } from './dtos/generate-ai.dto';

@ApiTags('AI')
@ApiBearerAuth()
@Controller('/api/ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
    ) { }

    @Post('generate')
    @ApiOperation({
        summary: 'Generate AI response',
    })
    @ApiResponse({
        status: 200,
        description: 'AI response generated successfully.',
    })
    async generate(
        @Param('conversationId') conversationId: string,
        @Body() generateAiDto: GenerateAiDto,
    ) {
        return this.aiService.generate(
            conversationId,
            generateAiDto.prompt,
        );
    }
}