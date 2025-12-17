import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsObject } from "class-validator";

export class CreateAreaOfInterestDto {
  @ApiProperty({
    description: "Name of the area of interest",
    example: "Dolomites Region",
  })
  @IsNotEmpty()
  @IsString()
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
  @IsNotEmpty()
  @IsObject()
  geometry!: object;
}
