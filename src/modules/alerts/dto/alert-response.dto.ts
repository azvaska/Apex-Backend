import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AlertResponseDto {
  @ApiProperty({
    description: "Unique identifier of the alert event",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "User ID who received this alert",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  userId: string;

  @ApiProperty({
    description: "Area of interest ID where the alert was triggered",
    example: "550e8400-e29b-41d4-a716-446655440002",
  })
  areaId: string;

  @ApiProperty({
    description: "Risk index level (1-5)",
    example: 4,
  })
  riskIndex: number;

  @ApiProperty({
    description: "Alert message describing the risk",
    example:
      "High avalanche risk detected in Dolomites Region. Risk level: 4/5",
  })
  message: string;

  @ApiProperty({
    description: "When the alert was created",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;
}

export class AlertWithAreaResponseDto extends AlertResponseDto {
  @ApiProperty({
    description: "Area of interest details",
    example: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "Dolomites Region",
    },
  })
  area: {
    id: string;
    name: string;
  };
}

export class PaginatedAlertsResponseDto {
  @ApiProperty({
    description: "List of alerts",
    type: [AlertWithAreaResponseDto],
  })
  data: AlertWithAreaResponseDto[];

  @ApiProperty({
    description: "Total number of alerts matching the query",
    example: 42,
  })
  total: number;

  @ApiProperty({
    description: "Current page number",
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: "Total number of pages",
    example: 5,
  })
  totalPages: number;
}
