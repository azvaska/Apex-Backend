import {
  IsOptional,
  IsUUID,
  IsInt,
  IsDateString,
  Min,
  Max,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class AlertQueryDto {
  @ApiPropertyOptional({
    description: "Filter by area of interest ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsOptional()
  @IsUUID()
  areaId?: string;

  @ApiPropertyOptional({
    description: "Filter alerts from this date (ISO 8601 format)",
    example: "2024-01-01T00:00:00.000Z",
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: "Filter alerts until this date (ISO 8601 format)",
    example: "2024-12-31T23:59:59.999Z",
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({
    description: "Minimum risk index to filter (1-5)",
    example: 3,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  minRiskIndex?: number;

  @ApiPropertyOptional({
    description: "Page number for pagination",
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Number of items per page",
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
