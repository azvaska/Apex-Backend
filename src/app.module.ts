import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { FirebaseModule } from "./modules/auth/firebase.module";
import { UserModule } from "./modules/user/user.module";
import { AreaOfInterestModule } from "./modules/area-of-interest/area-of-interest.module";
import { AlertsModule } from "./modules/alerts/alerts.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    AuthModule,
    UserModule,
    AreaOfInterestModule,
    AlertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
