import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { FirebaseGuard, FirebaseUser } from "@alpha018/nestjs-firebase-auth";
import { UserService } from "./user.service";
import { UserResponseDto } from "./dto/user-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("users")
@ApiBearerAuth("bearer")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @UseGuards(FirebaseGuard)
  @ApiOkResponse({
    description: "User data retrieved successfully",
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  async getCurrentUser(
    @FirebaseUser() firebaseUser: any,
  ): Promise<UserResponseDto> {
    return this.userService.getCurrentUser(firebaseUser.uid);
  }

  @Patch("me")
  @UseGuards(FirebaseGuard)
  @ApiOkResponse({
    description: "User data updated successfully",
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  async updateCurrentUser(
    @FirebaseUser() firebaseUser: any,
    @Body() updateDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateCurrentUser(firebaseUser.uid, updateDto);
  }
}
