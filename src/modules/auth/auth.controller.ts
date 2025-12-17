import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("users")
@ApiBearerAuth("bearer")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: "List users" })
  @Post("signup")
  async signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }
}
