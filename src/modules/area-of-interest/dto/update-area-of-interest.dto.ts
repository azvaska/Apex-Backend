import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsObject } from "class-validator";

export class UpdateAreaOfInterestDto {
  @ApiPropertyOptional({
    description: "Name of the area of interest",
    example: "Dolomites Region Updated",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "GeoJSON geometry object representing the area",
    example: {
      type: "Polygon",
      coordinates: [
        [
          [11.8, 46.4],
          [12.2, 46.4],
          [12.2, 46.7],
          [11.8, 46.7],
          [11.8, 46.4],
        ],
      ],
    },
  })
  @IsOptional()
  @IsObject()
  geometry?: object;
}
