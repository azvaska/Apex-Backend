import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaService } from "../../common/prisma.service";
import { ChatRequestDto } from "./dto/chat-request.dto";
import { ChatResponseDto } from "./dto/chat-response.dto";

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async chat(userId: string, dto: ChatRequestDto): Promise<ChatResponseDto> {
    const area = await this.prisma.areaOfInterest.findUnique({
      where: { id: dto.areaId },
      select: { id: true, name: true },
    });

    if (!area) {
      throw new NotFoundException("Area not found");
    }

    const conversationId = dto.conversationId ?? randomUUID();
    let context = await this.prisma.conversationContext.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    if (!context) {
      context = await this.prisma.conversationContext.create({
        data: {
          conversationId,
          userId,
          areaId: area.id,
        },
      });
    }

    const answerText =
      "Ho ricevuto la tua richiesta. Al momento non risultano criticita attive per l'area selezionata. Se vuoi, dimmi cosa stai osservando sul campo.";

    const answer = await this.prisma.aIAnswer.create({
      data: {
        contextId: context.id,
        text: answerText,
      },
    });

    return {
      conversationId: context.conversationId,
      answer: answer.text,
      createdAt: answer.generatedAt,
    };
  }
}
