import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { FirebaseGuard, FirebaseUser } from "@alpha018/nestjs-firebase-auth";
import { AlertsService } from "./alerts.service";
import { AlertPreferencesService } from "./alert-preferences.service";
import { PrismaService } from "../../common/prisma.service";
import {
  CreateAlertPreferenceDto,
  UpdateAlertPreferenceDto,
  AlertPreferenceWithAreaResponseDto,
  AlertQueryDto,
  AlertWithAreaResponseDto,
  PaginatedAlertsResponseDto,
} from "./dto";

@ApiTags("alerts")
@ApiBearerAuth("bearer")
@Controller("alerts")
@UseGuards(FirebaseGuard)
export class AlertsController {
  constructor(
    private readonly alertsService: AlertsService,
    private readonly alertPreferencesService: AlertPreferencesService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Helper to get internal user ID from Firebase UID
   */
  private async getUserId(firebaseUid: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user.id;
  }

  // ==================== ALERT PREFERENCES ====================

  @Get("preferences")
  @ApiOperation({ summary: "Get all alert preferences for the current user" })
  @ApiOkResponse({
    description: "List of alert preferences",
    type: [AlertPreferenceWithAreaResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getUserPreferences(
    @FirebaseUser() firebaseUser: any,
  ): Promise<AlertPreferenceWithAreaResponseDto[]> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertPreferencesService.getUserPreferences(userId);
  }

  @Get("preferences/area/:areaId")
  @ApiOperation({ summary: "Get alert preference for a specific area" })
  @ApiParam({ name: "areaId", description: "Area of interest UUID" })
  @ApiOkResponse({
    description: "Alert preference for the area",
    type: AlertPreferenceWithAreaResponseDto,
  })
  @ApiNotFoundResponse({ description: "Preference not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getPreferenceByArea(
    @FirebaseUser() firebaseUser: any,
    @Param("areaId", ParseUUIDPipe) areaId: string,
  ): Promise<AlertPreferenceWithAreaResponseDto> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertPreferencesService.getPreferenceByArea(userId, areaId);
  }

  @Get("preferences/:id")
  @ApiOperation({ summary: "Get a specific alert preference by ID" })
  @ApiParam({ name: "id", description: "Alert preference UUID" })
  @ApiOkResponse({
    description: "Alert preference details",
    type: AlertPreferenceWithAreaResponseDto,
  })
  @ApiNotFoundResponse({ description: "Preference not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getPreferenceById(
    @FirebaseUser() firebaseUser: any,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<AlertPreferenceWithAreaResponseDto> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertPreferencesService.getPreferenceById(userId, id);
  }

  @Post("preferences")
  @ApiOperation({ summary: "Create a new alert preference" })
  @ApiCreatedResponse({
    description: "Alert preference created successfully",
    type: AlertPreferenceWithAreaResponseDto,
  })
  @ApiConflictResponse({
    description: "Preference already exists for this area",
  })
  @ApiNotFoundResponse({ description: "Area not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async createPreference(
    @FirebaseUser() firebaseUser: any,
    @Body() dto: CreateAlertPreferenceDto,
  ): Promise<AlertPreferenceWithAreaResponseDto> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertPreferencesService.createPreference(userId, dto);
  }

  @Patch("preferences/:id")
  @ApiOperation({ summary: "Update an existing alert preference" })
  @ApiParam({ name: "id", description: "Alert preference UUID" })
  @ApiOkResponse({
    description: "Alert preference updated successfully",
    type: AlertPreferenceWithAreaResponseDto,
  })
  @ApiNotFoundResponse({ description: "Preference not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async updatePreference(
    @FirebaseUser() firebaseUser: any,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateAlertPreferenceDto,
  ): Promise<AlertPreferenceWithAreaResponseDto> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertPreferencesService.updatePreference(userId, id, dto);
  }

  @Patch("preferences/:id/toggle")
  @ApiOperation({ summary: "Toggle enabled status of an alert preference" })
  @ApiParam({ name: "id", description: "Alert preference UUID" })
  @ApiOkResponse({
    description: "Alert preference toggled successfully",
    type: AlertPreferenceWithAreaResponseDto,
  })
  @ApiNotFoundResponse({ description: "Preference not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async togglePreference(
    @FirebaseUser() firebaseUser: any,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<AlertPreferenceWithAreaResponseDto> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertPreferencesService.togglePreference(userId, id);
  }

  @Delete("preferences/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete an alert preference" })
  @ApiParam({ name: "id", description: "Alert preference UUID" })
  @ApiNoContentResponse({
    description: "Alert preference deleted successfully",
  })
  @ApiNotFoundResponse({ description: "Preference not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async deletePreference(
    @FirebaseUser() firebaseUser: any,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<void> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertPreferencesService.deletePreference(userId, id);
  }

  // ==================== ALERTS ====================

  @Get()
  @ApiOperation({ summary: "Get paginated alerts for the current user" })
  @ApiOkResponse({
    description: "Paginated list of alerts",
    type: PaginatedAlertsResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getUserAlerts(
    @FirebaseUser() firebaseUser: any,
    @Query() query: AlertQueryDto,
  ): Promise<PaginatedAlertsResponseDto> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertsService.getUserAlerts(userId, query);
  }

  @Get("active")
  @ApiOperation({
    summary: "Get active/recent alerts (last 24 hours by default)",
  })
  @ApiQuery({
    name: "hoursBack",
    required: false,
    description: "Number of hours to look back (default: 24)",
    type: Number,
  })
  @ApiOkResponse({
    description: "List of active alerts",
    type: [AlertWithAreaResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getActiveAlerts(
    @FirebaseUser() firebaseUser: any,
    @Query("hoursBack") hoursBack?: number,
  ): Promise<AlertWithAreaResponseDto[]> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertsService.getActiveAlerts(userId, hoursBack || 24);
  }

  @Get("high-priority")
  @ApiOperation({ summary: "Get high priority alerts (risk index >= 4)" })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Maximum number of alerts to return (default: 10)",
    type: Number,
  })
  @ApiOkResponse({
    description: "List of high priority alerts",
    type: [AlertWithAreaResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getHighPriorityAlerts(
    @FirebaseUser() firebaseUser: any,
    @Query("limit") limit?: number,
  ): Promise<AlertWithAreaResponseDto[]> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertsService.getHighPriorityAlerts(userId, limit || 10);
  }

  @Get("stats")
  @ApiOperation({ summary: "Get alert statistics for the current user" })
  @ApiOkResponse({
    description: "Alert statistics",
    schema: {
      type: "object",
      properties: {
        totalAlerts: { type: "number", example: 42 },
        alertsLast24h: { type: "number", example: 5 },
        alertsLast7d: { type: "number", example: 15 },
        alertsByRiskLevel: {
          type: "array",
          items: {
            type: "object",
            properties: {
              riskIndex: { type: "number", example: 3 },
              count: { type: "number", example: 10 },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getAlertStats(@FirebaseUser() firebaseUser: any): Promise<{
    totalAlerts: number;
    alertsLast24h: number;
    alertsLast7d: number;
    alertsByRiskLevel: { riskIndex: number; count: number }[];
  }> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertsService.getAlertStats(userId);
  }

  @Get("area/:areaId")
  @ApiOperation({ summary: "Get alerts for a specific area" })
  @ApiParam({ name: "areaId", description: "Area of interest UUID" })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Maximum number of alerts to return (default: 20)",
    type: Number,
  })
  @ApiOkResponse({
    description: "List of alerts for the area",
    type: [AlertWithAreaResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getAlertsByArea(
    @FirebaseUser() firebaseUser: any,
    @Param("areaId", ParseUUIDPipe) areaId: string,
    @Query("limit") limit?: number,
  ): Promise<AlertWithAreaResponseDto[]> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertsService.getAlertsByArea(userId, areaId, limit || 20);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific alert by ID" })
  @ApiParam({ name: "id", description: "Alert UUID" })
  @ApiOkResponse({
    description: "Alert details",
    type: AlertWithAreaResponseDto,
  })
  @ApiNotFoundResponse({ description: "Alert not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getAlertById(
    @FirebaseUser() firebaseUser: any,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<AlertWithAreaResponseDto> {
    const userId = await this.getUserId(firebaseUser.uid);
    return this.alertsService.getAlertById(userId, id);
  }
}
