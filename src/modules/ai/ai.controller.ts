import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { FirebaseGuard, FirebaseUser } from "@alpha018/nestjs-firebase-auth";
import { AiService } from "./ai.service";
import { ChatRequestDto } from "./dto/chat-request.dto";
import { ChatResponseDto } from "./dto/chat-response.dto";
import { UserService } from "../user/user.service";

@ApiTags("ai")
@ApiBearerAuth("bearer")
@Controller("ai")
@UseGuards(FirebaseGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly userService: UserService,
  ) {}

  @Post("chat")
  @ApiOperation({ summary: "Send a message to the AI assistant" })
  @ApiCreatedResponse({
    description: "Assistant response",
    type: ChatResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiNotFoundResponse({
    description: "Area not found",
  })
  async chat(
    @FirebaseUser() firebaseUser: { uid: string },
    @Body() dto: ChatRequestDto,
  ): Promise<ChatResponseDto> {
    const user = await this.userService.getCurrentUser(firebaseUser.uid);
    return this.aiService.chat(user.id, dto);
  }
}
