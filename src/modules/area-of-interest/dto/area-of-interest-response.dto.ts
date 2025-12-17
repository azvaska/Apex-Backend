import { ApiProperty } from "@nestjs/swagger";

export class AreaOfInterestResponseDto {
  @ApiProperty({
    description: "Unique identifier (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id!: string;

  @ApiProperty({
    description: "Name of the area of interest",
    example: "Dolomites Region",
  })
  name!: string;

  @ApiProperty({
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
  geometry!: object;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt!: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  updatedAt!: Date;
}
