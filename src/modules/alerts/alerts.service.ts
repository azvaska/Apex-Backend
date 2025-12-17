import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import {
  AlertQueryDto,
  AlertWithAreaResponseDto,
  PaginatedAlertsResponseDto,
} from "./dto";

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get paginated alerts for a user with optional filters
   */
  async getUserAlerts(
    userId: string,
    query: AlertQueryDto,
  ): Promise<PaginatedAlertsResponseDto> {
    const {
      areaId,
      fromDate,
      toDate,
      minRiskIndex,
      page = 1,
      limit = 10,
    } = query;

    // Build where clause
    const where: any = { userId };

    if (areaId) {
      where.areaId = areaId;
    }

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) {
        where.createdAt.gte = new Date(fromDate);
      }
      if (toDate) {
        where.createdAt.lte = new Date(toDate);
      }
    }

    if (minRiskIndex) {
      where.riskIndex = { gte: minRiskIndex };
    }

    // Get total count
    const total = await this.prisma.alertEvent.count({ where });

    // Get paginated results
    const alerts = await this.prisma.alertEvent.findMany({
      where,
      include: {
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: alerts,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get active/recent alerts for a user (last 24 hours by default)
   */
  async getActiveAlerts(
    userId: string,
    hoursBack: number = 24,
  ): Promise<AlertWithAreaResponseDto[]> {
    const since = new Date();
    since.setHours(since.getHours() - hoursBack);

    const alerts = await this.prisma.alertEvent.findMany({
      where: {
        userId,
        createdAt: {
          gte: since,
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
      orderBy: { createdAt: "desc" },
    });

    return alerts;
  }

  /**
   * Get a specific alert by ID
   */
  async getAlertById(
    userId: string,
    alertId: string,
  ): Promise<AlertWithAreaResponseDto> {
    const alert = await this.prisma.alertEvent.findFirst({
      where: {
        id: alertId,
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

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    return alert;
  }

  /**
   * Get alerts by area for a user
   */
  async getAlertsByArea(
    userId: string,
    areaId: string,
    limit: number = 20,
  ): Promise<AlertWithAreaResponseDto[]> {
    const alerts = await this.prisma.alertEvent.findMany({
      where: {
        userId,
        areaId,
      },
      include: {
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return alerts;
  }

  /**
   * Get alert statistics for a user
   */
  async getAlertStats(userId: string): Promise<{
    totalAlerts: number;
    alertsLast24h: number;
    alertsLast7d: number;
    alertsByRiskLevel: { riskIndex: number; count: number }[];
  }> {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalAlerts, alertsLast24h, alertsLast7d, alertsByRiskLevel] =
      await Promise.all([
        this.prisma.alertEvent.count({ where: { userId } }),
        this.prisma.alertEvent.count({
          where: { userId, createdAt: { gte: last24h } },
        }),
        this.prisma.alertEvent.count({
          where: { userId, createdAt: { gte: last7d } },
        }),
        this.prisma.alertEvent.groupBy({
          by: ["riskIndex"],
          where: { userId },
          _count: { riskIndex: true },
          orderBy: { riskIndex: "asc" },
        }),
      ]);

    return {
      totalAlerts,
      alertsLast24h,
      alertsLast7d,
      alertsByRiskLevel: alertsByRiskLevel.map((item) => ({
        riskIndex: item.riskIndex,
        count: item._count.riskIndex,
      })),
    };
  }

  /**
   * Get high priority alerts (risk index >= 4)
   */
  async getHighPriorityAlerts(
    userId: string,
    limit: number = 10,
  ): Promise<AlertWithAreaResponseDto[]> {
    const alerts = await this.prisma.alertEvent.findMany({
      where: {
        userId,
        riskIndex: { gte: 4 },
      },
      include: {
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return alerts;
  }
}
