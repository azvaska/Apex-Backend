import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { PrismaService } from "../../common/prisma.service";
import { UserService } from "../user/user.service";

@Module({
  controllers: [AiController],
  providers: [AiService, PrismaService, UserService],
})
export class AiModule {}
