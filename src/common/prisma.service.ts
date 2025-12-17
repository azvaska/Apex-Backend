import { Injectable } from "@nestjs/common";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly config: ConfigService) {
    const connectionString = config.get<string>("DATABASE_URL");

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
}
