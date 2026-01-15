import { ApiProperty } from "@nestjs/swagger";

export class EnvironmentalSampleResponseDto {
  @ApiProperty({
    description: "Unique identifier (UUID)",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id!: string;

  @ApiProperty({
    description: "Area of interest ID",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  areaId!: string;

  @ApiProperty({
    description: "Sample timestamp",
    example: "2024-12-10T06:00:00.000Z",
  })
  timestamp!: Date;

  @ApiProperty({ description: "Air temperature in °C", example: -6.5 })
  airTemperatureC!: number;

  @ApiProperty({ description: "Relative humidity (%)", example: 82 })
  relativeHumidity!: number;

  @ApiProperty({ description: "Wind speed (m/s)", example: 7.8 })
  windSpeedMs!: number;

  @ApiProperty({ description: "Wind direction (degrees)", example: 290 })
  windDirectionDeg!: number;

  @ApiProperty({ description: "Precipitation (mm)", example: 12.0 })
  precipitationMm!: number;

  @ApiProperty({
    description: "Data source",
    example: "Meteomont",
  })
  source!: string;
}
