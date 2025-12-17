import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({
    description: "Unique user identifier (UUID)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id!: string;

  @ApiProperty({
    description: "Firebase authentication UID",
    example: "firebase-uid-123456",
  })
  firebaseUid!: string;

  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  email!: string;

  @ApiProperty({
    description: "User first name",
    example: "John",
  })
  name!: string;

  @ApiProperty({
    description: "User surname/last name",
    example: "Doe",
  })
  surname!: string;

  @ApiProperty({
    description: "Profile image URL or base64 encoded image",
    example: "https://example.com/profile.jpg",
    nullable: true,
  })
  profileImage!: string | null;

  @ApiProperty({
    description: "Account creation timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt!: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  updatedAt!: Date;
}
