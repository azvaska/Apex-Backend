import { Module } from "@nestjs/common";
import { AlertsController } from "./alerts.controller";
import { AlertsService } from "./alerts.service";
import { AlertPreferencesService } from "./alert-preferences.service";
import { PrismaService } from "../../common/prisma.service";

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, AlertPreferencesService, PrismaService],
  exports: [AlertsService, AlertPreferencesService],
})
export class AlertsModule {}
