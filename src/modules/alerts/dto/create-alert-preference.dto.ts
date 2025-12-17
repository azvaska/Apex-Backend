import {
  IsUUID,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAlertPreferenceDto {
  @ApiProperty({
    description: "UUID of the area of interest",
    example: "550e8400-e29b-41d4-a716-446655440000",
    format: "uuid",
  })
  @IsUUID()
  areaId: string;

  @ApiProperty({
    description: "Avalanche risk threshold (0-5 scale)",
    example: 3,
    minimum: 0,
    maximum: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  avalancheThreshold: number;

  @ApiProperty({
    description: "Enable flood alerts",
    example: true,
  })
  @IsBoolean()
  flood: boolean;

  @ApiProperty({
    description: "Enable storm alerts",
    example: true,
  })
  @IsBoolean()
  storm: boolean;

  @ApiProperty({
    description: "Enable landslide alerts",
    example: false,
  })
  @IsBoolean()
  landslide: boolean;

  @ApiPropertyOptional({
    description: "Enable or disable this alert preference",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean = true;
}
