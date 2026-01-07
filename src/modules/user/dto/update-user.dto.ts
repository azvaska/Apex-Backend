import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsOptional, IsString, MaxLength, Matches} from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "User first name",
    example: "John",
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional({
    description: "User surname/last name",
    example: "Doe",
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  surname?: string;

  @ApiPropertyOptional({
    description: "Base64 encoded profile image (with data URI prefix)",
    example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
  })
  @IsOptional()
  @IsString()
  @Matches(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, {
    message: "Image must be a valid base64 data URL with format: data:image/(jpeg|jpg|png|gif|webp);base64,...",
  })
  profileImage?: string;
}
