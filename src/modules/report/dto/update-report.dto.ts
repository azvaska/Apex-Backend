import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsBoolean, Matches } from "class-validator";

export class UpdateReportDto {
  @ApiPropertyOptional({
    description: "Title of the report",
    example: "Updated Avalanche Warning",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: "Detailed text content of the report",
    example:
      "Updated conditions: Snow has stabilized after warming temperatures.",
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    description: "Whether the report is active",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description:
      "Base64 encoded image with data URL prefix (e.g., data:image/jpeg;base64,...). Set to null to remove existing image.",
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
