import { Body, Controller, Delete, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { UpdateFcmTokenDto } from "./dto/update-fcm-token.dto";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { FirebaseGuard, FirebaseUser } from "@alpha018/nestjs-firebase-auth";
import { UserResponseDto } from "../user/dto/user-response.dto";

@ApiTags("auth")
@ApiBearerAuth("bearer")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: "User created successfully" })
  @Post("signup")
  async signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post("fcm-token")
  @UseGuards(FirebaseGuard)
  @ApiOkResponse({
    description: "FCM token updated successfully",
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  async updateFcmToken(
    @FirebaseUser() firebaseUser: any,
    @Body() dto: UpdateFcmTokenDto,
  ) {
    return this.authService.updateFcmToken(firebaseUser.uid, dto);
  }

  @Delete("fcm-token")
  @UseGuards(FirebaseGuard)
  @ApiOkResponse({
    description: "FCM token cleared successfully",
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  async clearFcmToken(@FirebaseUser() firebaseUser: any) {
    return this.authService.clearFcmToken(firebaseUser.uid);
  }
}
