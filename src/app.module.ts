/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ExtractJwt } from "passport-jwt";

import { FirebaseAdminModule } from "@alpha018/nestjs-firebase-auth";

@Module({
  imports: [
    ConfigModule.forRoot(),
    FirebaseAdminModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        base64: configService.get("FIREBASE_SERVICE_ACCOUNT_BASE64"),
        options: {}, // Optionally, provide Firebase configuration here
        auth: {
          config: {
            extractor: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the header
            checkRevoked: true, // Optionally check if the token is revoked
            validateRole: true, // Enable role validation if needed
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
