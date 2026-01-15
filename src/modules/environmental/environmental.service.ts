import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { EnvironmentalSampleResponseDto } from "./dto/environmental-sample-response.dto";

@Injectable()
export class EnvironmentalService {
  constructor(private readonly prisma: PrismaService) {}

  async getLatestSample(
    areaId: string,
  ): Promise<EnvironmentalSampleResponseDto> {
    const sample = await this.prisma.environmentalSample.findFirst({
      where: { areaId },
      orderBy: { timestamp: "desc" },
    });

    if (!sample) {
      throw new NotFoundException("Environmental sample not found");
    }

    return sample as unknown as EnvironmentalSampleResponseDto;
  }
}
