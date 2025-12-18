import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  Matches,
} from "class-validator";

export class CreateReportDto {
  @ApiProperty({
    description: "Title of the report",
    example: "Avalanche Warning in Sector A",
  })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({
    description: "Detailed text content of the report",
    example:
      "Spotted dangerous snow conditions near the northern ridge. Fresh snow accumulation of approximately 30cm overnight with strong winds.",
  })
  @IsNotEmpty()
  @IsString()
  text!: string;

  @ApiProperty({
    description: "UUID of the area of interest this report belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsNotEmpty()
  @IsUUID()
  areaId!: string;

  @ApiPropertyOptional({
    description:
      "Base64 encoded image with data URL prefix (e.g., data:image/jpeg;base64,...)",
    example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
  })
  @IsOptional()
  @IsString()
  @Matches(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, {
    message:
      "Image must be a valid base64 data URL with format: data:image/(jpeg|jpg|png|gif|webp);base64,...",
  })
  image?: string;
}
