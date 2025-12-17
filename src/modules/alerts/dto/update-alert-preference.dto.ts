import {
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateAlertPreferenceDto {
  @ApiPropertyOptional({
    description: "Avalanche risk threshold (0-5 scale)",
    example: 3,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  avalancheThreshold?: number;

  @ApiPropertyOptional({
    description: "Enable flood alerts",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  flood?: boolean;

  @ApiPropertyOptional({
    description: "Enable storm alerts",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  storm?: boolean;

  @ApiPropertyOptional({
    description: "Enable landslide alerts",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  landslide?: boolean;

  @ApiPropertyOptional({
    description: "Enable or disable this alert preference",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
