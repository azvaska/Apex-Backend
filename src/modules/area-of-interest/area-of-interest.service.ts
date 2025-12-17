import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import {
  CreateAreaOfInterestDto,
  UpdateAreaOfInterestDto,
  AreaOfInterestResponseDto,
  AreaOfInterestQueryDto,
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

@Injectable()
export class AreaOfInterestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createDto: CreateAreaOfInterestDto,
  ): Promise<AreaOfInterestResponseDto> {
    const areaOfInterest = await this.prisma.areaOfInterest.create({
      data: {
        name: createDto.name,
        geometry: createDto.geometry,
      },
    });

    return areaOfInterest as AreaOfInterestResponseDto;
  }

  async findAll(
    query: AreaOfInterestQueryDto,
  ): Promise<PaginatedResponse<AreaOfInterestResponseDto>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.areaOfInterest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.areaOfInterest.count({ where }),
    ]);

    return {
      data: data as AreaOfInterestResponseDto[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<AreaOfInterestResponseDto> {
    const areaOfInterest = await this.prisma.areaOfInterest.findUnique({
      where: { id },
    });

    if (!areaOfInterest) {
      throw new NotFoundException(`Area of interest with ID "${id}" not found`);
    }

    return areaOfInterest as AreaOfInterestResponseDto;
  }

  async update(
    id: string,
    updateDto: UpdateAreaOfInterestDto,
  ): Promise<AreaOfInterestResponseDto> {
    // Check if exists
    await this.findOne(id);

    const areaOfInterest = await this.prisma.areaOfInterest.update({
      where: { id },
      data: {
        ...(updateDto.name && { name: updateDto.name }),
        ...(updateDto.geometry && { geometry: updateDto.geometry }),
      },
    });

    return areaOfInterest as AreaOfInterestResponseDto;
  }

  async remove(id: string): Promise<void> {
    // Check if exists
    await this.findOne(id);

    await this.prisma.areaOfInterest.delete({
      where: { id },
    });
  }
}
