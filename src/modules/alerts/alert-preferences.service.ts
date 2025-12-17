import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import {
  CreateAlertPreferenceDto,
  UpdateAlertPreferenceDto,
  AlertPreferenceResponseDto,
  AlertPreferenceWithAreaResponseDto,
} from "./dto";

@Injectable()
export class AlertPreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all alert preferences for a user
   */
  async getUserPreferences(
    userId: string,
  ): Promise<AlertPreferenceWithAreaResponseDto[]> {
    const preferences = await this.prisma.alertPreference.findMany({
      where: { userId },
      include: {
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return preferences;
  }

  /**
   * Get alert preference for a specific area
   */
  async getPreferenceByArea(
    userId: string,
    areaId: string,
  ): Promise<AlertPreferenceWithAreaResponseDto> {
    const preference = await this.prisma.alertPreference.findUnique({
      where: {
        userId_areaId: {
          userId,
          areaId,
        },
      },
      include: {
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!preference) {
      throw new NotFoundException(
        `Alert preference not found for area ${areaId}`,
      );
    }

    return preference;
  }

  /**
   * Get alert preference by ID
   */
  async getPreferenceById(
    userId: string,
    preferenceId: string,
  ): Promise<AlertPreferenceWithAreaResponseDto> {
    const preference = await this.prisma.alertPreference.findFirst({
      where: {
        id: preferenceId,
        userId,
      },
      include: {
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!preference) {
      throw new NotFoundException(
        `Alert preference with ID ${preferenceId} not found`,
      );
    }

    return preference;
  }

  /**
   * Create a new alert preference
   */
  async createPreference(
    userId: string,
    dto: CreateAlertPreferenceDto,
  ): Promise<AlertPreferenceWithAreaResponseDto> {
    // Check if area exists
    const area = await this.prisma.areaOfInterest.findUnique({
      where: { id: dto.areaId },
    });

    if (!area) {
      throw new NotFoundException(`Area of interest ${dto.areaId} not found`);
    }

    // Check if preference already exists for this user and area
    const existingPreference = await this.prisma.alertPreference.findUnique({
      where: {
        userId_areaId: {
          userId,
          areaId: dto.areaId,
        },
      },
    });

    if (existingPreference) {
      throw new ConflictException(
        `Alert preference already exists for area ${dto.areaId}. Use PATCH to update.`,
      );
    }

    const preference = await this.prisma.alertPreference.create({
      data: {
        userId,
        areaId: dto.areaId,
        avalancheThreshold: dto.avalancheThreshold,
        flood: dto.flood,
        storm: dto.storm,
        landslide: dto.landslide,
        enabled: dto.enabled ?? true,
      },
      include: {
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return preference;
  }

  /**
   * Update an existing alert preference
   */
  async updatePreference(
    userId: string,
    preferenceId: string,
    dto: UpdateAlertPreferenceDto,
  ): Promise<AlertPreferenceWithAreaResponseDto> {
    // Verify the preference exists and belongs to the user
    const existingPreference = await this.prisma.alertPreference.findFirst({
      where: {
        id: preferenceId,
        userId,
      },
    });

    if (!existingPreference) {
      throw new NotFoundException(
        `Alert preference with ID ${preferenceId} not found`,
      );
    }

    const preference = await this.prisma.alertPreference.update({
      where: { id: preferenceId },
      data: {
        ...(dto.avalancheThreshold !== undefined && {
          avalancheThreshold: dto.avalancheThreshold,
        }),
        ...(dto.flood !== undefined && { flood: dto.flood }),
        ...(dto.storm !== undefined && { storm: dto.storm }),
        ...(dto.landslide !== undefined && { landslide: dto.landslide }),
        ...(dto.enabled !== undefined && { enabled: dto.enabled }),
      },
      include: {
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return preference;
  }

  /**
   * Delete an alert preference
   */
  async deletePreference(userId: string, preferenceId: string): Promise<void> {
    // Verify the preference exists and belongs to the user
    const existingPreference = await this.prisma.alertPreference.findFirst({
      where: {
        id: preferenceId,
        userId,
      },
    });

    if (!existingPreference) {
      throw new NotFoundException(
        `Alert preference with ID ${preferenceId} not found`,
      );
    }

    await this.prisma.alertPreference.delete({
      where: { id: preferenceId },
    });
  }

  /**
   * Toggle enabled status of an alert preference
   */
  async togglePreference(
    userId: string,
    preferenceId: string,
  ): Promise<AlertPreferenceWithAreaResponseDto> {
    const existingPreference = await this.prisma.alertPreference.findFirst({
      where: {
        id: preferenceId,
        userId,
      },
    });

    if (!existingPreference) {
      throw new NotFoundException(
        `Alert preference with ID ${preferenceId} not found`,
      );
    }

    const preference = await this.prisma.alertPreference.update({
      where: { id: preferenceId },
      data: {
        enabled: !existingPreference.enabled,
      },
      include: {
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return preference;
  }
}
