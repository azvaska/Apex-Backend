import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { UserResponseDto } from "./dto/user-response.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentUser(firebaseUid: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        firebaseUid,
      },
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        name: true,
        surname: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
