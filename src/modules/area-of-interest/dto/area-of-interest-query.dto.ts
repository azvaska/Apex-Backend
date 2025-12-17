import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsInt, Min, Max, IsString } from "class-validator";
import { Type } from "class-transformer";

export class AreaOfInterestQueryDto {
  @ApiPropertyOptional({
    description: "Page number (1-based)",
    example: 1,
    default: 1,
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
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: "Search by name (partial match)",
    example: "Dolomites",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
