import { ApiProperty } from "@nestjs/swagger";

export class AlertPreferenceResponseDto {
  @ApiProperty({
    description: "Unique identifier of the alert preference",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "User ID who owns this preference",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  userId: string;

  @ApiProperty({
    description: "Area of interest ID",
    example: "550e8400-e29b-41d4-a716-446655440002",
  })
  areaId: string;

  @ApiProperty({
    description: "Avalanche risk threshold (0-5 scale)",
    example: 3,
  })
  avalancheThreshold: number;

  @ApiProperty({
    description: "Flood alerts enabled",
    example: true,
  })
  flood: boolean;

  @ApiProperty({
    description: "Storm alerts enabled",
    example: true,
  })
  storm: boolean;

  @ApiProperty({
    description: "Landslide alerts enabled",
    example: false,
  })
  landslide: boolean;

  @ApiProperty({
    description: "Whether this preference is enabled",
    example: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  updatedAt: Date;
}

export class AlertPreferenceWithAreaResponseDto extends AlertPreferenceResponseDto {
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
