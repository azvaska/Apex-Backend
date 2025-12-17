import { Module } from "@nestjs/common";
import { AreaOfInterestController } from "./area-of-interest.controller";
import { AreaOfInterestService } from "./area-of-interest.service";
import { PrismaService } from "../../common/prisma.service";

@Module({
  controllers: [AreaOfInterestController],
  providers: [AreaOfInterestService, PrismaService],
  exports: [AreaOfInterestService],
})
export class AreaOfInterestModule {}
