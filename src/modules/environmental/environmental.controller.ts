import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
} from "@nestjs/swagger";
import { FirebaseGuard } from "@alpha018/nestjs-firebase-auth";
import { EnvironmentalService } from "./environmental.service";
import { EnvironmentalSampleResponseDto } from "./dto/environmental-sample-response.dto";

@ApiTags("environmental")
@ApiBearerAuth("bearer")
@Controller("environmental")
@UseGuards(FirebaseGuard)
export class EnvironmentalController {
  constructor(private readonly environmentalService: EnvironmentalService) {}

  @Get("latest/:areaId")
  @ApiOperation({ summary: "Get latest environmental sample for an area" })
  @ApiParam({ name: "areaId", description: "Area of interest UUID" })
  @ApiOkResponse({
    description: "Latest environmental sample",
    type: EnvironmentalSampleResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiNotFoundResponse({ description: "Sample not found" })
  async getLatestSample(
    @Param("areaId", ParseUUIDPipe) areaId: string,
  ): Promise<EnvironmentalSampleResponseDto> {
    return this.environmentalService.getLatestSample(areaId);
  }
}
