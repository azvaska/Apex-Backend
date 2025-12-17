import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
    format: "email",
  })
  @IsEmail()
  email: string;

  // Firebase email/password requires at least 6 chars
  @ApiProperty({
    description: "User password (minimum 6 characters required by Firebase)",
    example: "SecurePass123!",
    minLength: 6,
    maxLength: 128,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @ApiProperty({
    description: "User first name",
    example: "John",
    maxLength: 80,
  })
  @IsString()
  @MaxLength(80)
  name: string;

  @ApiProperty({
    description: "User last name",
    example: "Doe",
    maxLength: 80,
  })
  @IsString()
  @MaxLength(80)
  surname: string;

  @ApiPropertyOptional({
    description: "Base64 encoded profile image (with or without data URI prefix)",
    example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
  })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
