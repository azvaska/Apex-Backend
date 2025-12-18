import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateFcmTokenDto {
  @ApiProperty({
    description:
      "Firebase Cloud Messaging (FCM) device token for push notifications",
    example: "dGVzdC1mY20tdG9rZW4tZXhhbXBsZS0xMjM0NTY3ODkw...",
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  fcmToken!: string;
}
