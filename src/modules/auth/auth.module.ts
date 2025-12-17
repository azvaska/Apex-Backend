import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../common/prisma.service";
import { AuthController } from "./auth.controller";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
