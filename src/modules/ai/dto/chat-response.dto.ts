import { ApiProperty } from "@nestjs/swagger";

export class ChatResponseDto {
  @ApiProperty({
    description: "Conversation identifier",
    example: "2f1c0a7a-8f48-4d0c-8bb8-8a7b6c9a1f11",
  })
  conversationId!: string;

  @ApiProperty({
    description: "Assistant response",
    example:
      "Al momento non ci sono criticita attive nell'area selezionata.",
  })
  answer!: string;

  @ApiProperty({
    description: "Timestamp of the assistant response",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt!: Date;
}
