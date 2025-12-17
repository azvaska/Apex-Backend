import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { FirebaseAdminModule } from "@alpha018/nestjs-firebase-auth";
import { ExtractJwt } from "passport-jwt";

@Global() // optional: makes it available app-wide once imported once
@Module({
  imports: [
    FirebaseAdminModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // SELECT ONLY ONE: base64 OR options
        base64: config.get<string>("FIREBASE_SERVICE_ACCOUNT_BASE64"),
        // options: {},

        auth: {
          config: {
            extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
            checkRevoked: true,
            validateRole: false,
          },
        },
      }),
    }),
  ],
  exports: [FirebaseAdminModule],
})
export class FirebaseModule {}
