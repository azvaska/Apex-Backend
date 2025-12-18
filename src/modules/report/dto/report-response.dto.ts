import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AttachmentResponseDto {
  @ApiProperty({
    description: "Unique identifier (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id!: string;

  @ApiProperty({
    description: "URL or base64 data URL of the attachment",
    example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
  })
  url!: string;

  @ApiPropertyOptional({
    description: "MIME type of the attachment",
    example: "image/jpeg",
  })
  mimeType?: string | null;

  @ApiPropertyOptional({
    description: "Size of the attachment in bytes",
    example: 12345,
  })
  sizeBytes?: number | null;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt!: Date;
}

export class UserSummaryDto {
  @ApiProperty({
    description: "Unique identifier (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id!: string;

  @ApiProperty({
    description: "User's email address",
    example: "john.doe@example.com",
  })
  email!: string;

  @ApiProperty({
    description: "User's first name",
    example: "John",
  })
  name!: string;

  @ApiProperty({
    description: "User's surname",
    example: "Doe",
  })
  surname!: string;

  @ApiPropertyOptional({
    description: "User's profile image URL",
    example: "https://example.com/profile.jpg",
  })
  profileImage?: string | null;
}

export class AreaSummaryDto {
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
}

export class CommentResponseDto {
  @ApiProperty({
    description: "Unique identifier (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id!: string;

  @ApiProperty({
    description: "Comment text",
    example: "Great observation, thanks for sharing!",
  })
  text!: string;

  @ApiProperty({
    description: "User who wrote the comment",
    type: UserSummaryDto,
  })
  user!: UserSummaryDto;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt!: Date;
}

export class ReportResponseDto {
  @ApiProperty({
    description: "Unique identifier (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id!: string;

  @ApiProperty({
    description: "Title of the report",
    example: "Avalanche Warning in Sector A",
  })
  title!: string;

  @ApiProperty({
    description: "Detailed text content of the report",
    example:
      "Spotted dangerous snow conditions near the northern ridge. Fresh snow accumulation of approximately 30cm overnight with strong winds.",
  })
  text!: string;

  @ApiProperty({
    description: "Whether the report is active",
    example: true,
  })
  active!: boolean;

  @ApiProperty({
    description: "User who created the report",
    type: UserSummaryDto,
  })
  user!: UserSummaryDto;

  @ApiProperty({
    description: "Area of interest this report belongs to",
    type: AreaSummaryDto,
  })
  area!: AreaSummaryDto;

  @ApiProperty({
    description: "Attachments (images) associated with the report",
    type: [AttachmentResponseDto],
  })
  attachments!: AttachmentResponseDto[];

  @ApiProperty({
    description: "Comments on the report",
    type: [CommentResponseDto],
  })
  comments!: CommentResponseDto[];

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
