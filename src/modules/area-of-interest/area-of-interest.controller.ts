import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
} from "@nestjs/swagger";
import { FirebaseGuard } from "@alpha018/nestjs-firebase-auth";
import {
  AreaOfInterestService,
  PaginatedResponse,
} from "./area-of-interest.service";
import {
  CreateAreaOfInterestDto,
  UpdateAreaOfInterestDto,
  AreaOfInterestResponseDto,
  AreaOfInterestQueryDto,
} from "./dto";

@ApiTags("areas-of-interest")
@ApiBearerAuth("bearer")
@Controller("areas-of-interest")
@UseGuards(FirebaseGuard)
export class AreaOfInterestController {
  constructor(private readonly areaOfInterestService: AreaOfInterestService) {}

  @Post()
  @ApiOperation({ summary: "Create a new area of interest" })
  @ApiCreatedResponse({
    description: "Area of interest created successfully",
    type: AreaOfInterestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
  })
  async create(
    @Body() createDto: CreateAreaOfInterestDto,
  ): Promise<AreaOfInterestResponseDto> {
    return this.areaOfInterestService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all areas of interest with pagination" })
  @ApiOkResponse({
    description: "List of areas of interest retrieved successfully",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  async findAll(
    @Query() query: AreaOfInterestQueryDto,
  ): Promise<PaginatedResponse<AreaOfInterestResponseDto>> {
    return this.areaOfInterestService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific area of interest by ID" })
  @ApiOkResponse({
    description: "Area of interest retrieved successfully",
    type: AreaOfInterestResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Area of interest not found",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  async findOne(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<AreaOfInterestResponseDto> {
    return this.areaOfInterestService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an area of interest" })
  @ApiOkResponse({
    description: "Area of interest updated successfully",
    type: AreaOfInterestResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Area of interest not found",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
  })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAreaOfInterestDto,
  ): Promise<AreaOfInterestResponseDto> {
    return this.areaOfInterestService.update(id, updateDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete an area of interest" })
  @ApiNoContentResponse({
    description: "Area of interest deleted successfully",
  })
  @ApiNotFoundResponse({
    description: "Area of interest not found",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.areaOfInterestService.remove(id);
  }
}
