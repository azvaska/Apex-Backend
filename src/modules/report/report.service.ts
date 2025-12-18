import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import {
  CreateReportDto,
  UpdateReportDto,
  ReportResponseDto,
  ReportQueryDto,
} from "./dto";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Helper to extract mime type and calculate size from base64 data URL
function parseBase64Image(dataUrl: string): {
  mimeType: string;
  sizeBytes: number;
} {
  const matches = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new BadRequestException("Invalid base64 image format");
  }

  const mimeType = `image/${matches[1]}`;
  const base64Data = matches[2];
  // Calculate approximate size in bytes (base64 is ~33% larger than binary)
  const sizeBytes = Math.ceil((base64Data.length * 3) / 4);

  return { mimeType, sizeBytes };
}

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    user: {
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        profileImage: true,
      },
    },
    area: {
      select: {
        id: true,
        name: true,
      },
    },
    attachments: true,
    comments: {
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            surname: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc" as const,
      },
    },
  };

  async create(
    userId: string,
    createDto: CreateReportDto,
  ): Promise<ReportResponseDto> {
    // Verify the area exists
    const area = await this.prisma.areaOfInterest.findUnique({
      where: { id: createDto.areaId },
    });

    if (!area) {
      throw new NotFoundException(
        `Area of interest with ID "${createDto.areaId}" not found`,
      );
    }

    // Prepare attachment data if image is provided
    let attachmentData: { url: string; mimeType: string; sizeBytes: number }[] =
      [];
    if (
      createDto.image !== undefined &&
      createDto.image !== null &&
      createDto.image !== ""
    ) {
      const { mimeType, sizeBytes } = parseBase64Image(createDto.image);
      attachmentData = [
        {
          url: createDto.image,
          mimeType,
          sizeBytes,
        },
      ];
    }

    const report = await this.prisma.report.create({
      data: {
        title: createDto.title,
        text: createDto.text,
        userId,
        areaId: createDto.areaId,
        ...(attachmentData.length > 0 && {
          attachments: {
            create: attachmentData,
          },
        }),
      },
      include: this.includeRelations,
    });

    return report as unknown as ReportResponseDto;
  }

  async findAll(
    query: ReportQueryDto,
  ): Promise<PaginatedResponse<ReportResponseDto>> {
    const { page = 1, limit = 10, search, areaId, userId, active } = query;
    const skip = (page - 1) * limit;

    const where: {
      title?: { contains: string; mode: "insensitive" };
      areaId?: string;
      userId?: string;
      active?: boolean;
    } = {};

    if (search !== undefined && search !== null && search !== "") {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (areaId !== undefined && areaId !== null && areaId !== "") {
      where.areaId = areaId;
    }

    if (userId !== undefined && userId !== null && userId !== "") {
      where.userId = userId;
    }

    if (active !== undefined) {
      where.active = active;
    }

    const [data, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: this.includeRelations,
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      data: data as unknown as ReportResponseDto[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ReportResponseDto> {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: this.includeRelations,
    });

    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }

    return report as unknown as ReportResponseDto;
  }

  async update(
    id: string,
    updateDto: UpdateReportDto,
  ): Promise<ReportResponseDto> {
    // Check if report exists
    await this.findOne(id);

    // Handle image update
    if (
      updateDto.image !== undefined &&
      updateDto.image !== null &&
      updateDto.image !== ""
    ) {
      // Add new image - first delete existing attachments, then create new one
      const { mimeType, sizeBytes } = parseBase64Image(updateDto.image);

      await this.prisma.attachmentMetadata.deleteMany({
        where: { reportId: id },
      });

      await this.prisma.attachmentMetadata.create({
        data: {
          reportId: id,
          url: updateDto.image,
          mimeType,
          sizeBytes,
        },
      });
    }

    const report = await this.prisma.report.update({
      where: { id },
      data: {
        ...(updateDto.title !== undefined && { title: updateDto.title }),
        ...(updateDto.text !== undefined && { text: updateDto.text }),
        ...(updateDto.active !== undefined && { active: updateDto.active }),
      },
      include: this.includeRelations,
    });

    return report as unknown as ReportResponseDto;
  }

  async remove(id: string): Promise<void> {
    // Check if report exists
    await this.findOne(id);

    await this.prisma.report.delete({
      where: { id },
    });
  }

  async findByUser(
    userId: string,
    query: ReportQueryDto,
  ): Promise<PaginatedResponse<ReportResponseDto>> {
    return this.findAll({ ...query, userId });
  }

  async findByArea(
    areaId: string,
    query: ReportQueryDto,
  ): Promise<PaginatedResponse<ReportResponseDto>> {
    return this.findAll({ ...query, areaId });
  }
}
