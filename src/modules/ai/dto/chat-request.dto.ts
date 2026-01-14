import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class ChatRequestDto {
  @ApiProperty({
    description: "User message to the assistant",
    example: "Qual e il rischio valanghe oggi?",
  })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({
    description: "Area of interest UUID for contextual answers",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID()
  areaId!: string;

  @ApiPropertyOptional({
    description: "Conversation identifier to continue a chat",
    example: "2f1c0a7a-8f48-4d0c-8bb8-8a7b6c9a1f11",
  })
  @IsOptional()
  @IsUUID()
  conversationId?: string;
}
