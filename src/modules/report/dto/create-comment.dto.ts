import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    description: "Text content of the comment",
    example: "Great observation, thanks for sharing this important information!",
    minLength: 1,
    maxLength: 2000,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text!: string;
}
