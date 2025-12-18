import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
// import { FirebaseGuard } from "@alpha018/nestjs-firebase-auth";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //1@UseGuards(FirebaseGuard) // This line protects your endpoint. If `validateRole` is enabled, it also validates the user's role.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
