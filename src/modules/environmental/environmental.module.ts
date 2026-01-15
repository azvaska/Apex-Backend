import { Module } from "@nestjs/common";
import { EnvironmentalController } from "./environmental.controller";
import { EnvironmentalService } from "./environmental.service";
import { PrismaService } from "../../common/prisma.service";

@Module({
  controllers: [EnvironmentalController],
  providers: [EnvironmentalService, PrismaService],
})
export class EnvironmentalModule {}
