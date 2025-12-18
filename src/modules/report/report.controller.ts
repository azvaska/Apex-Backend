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
import { FirebaseGuard, FirebaseUser } from "@alpha018/nestjs-firebase-auth";
import { ReportService, PaginatedResponse } from "./report.service";
import {
  CreateReportDto,
  UpdateReportDto,
  ReportResponseDto,
  ReportQueryDto,
  CreateCommentDto,
  CommentQueryDto,
  CommentResponseDto,
} from "./dto";
import { UserService } from "../user/user.service";

@ApiTags("reports")
@ApiBearerAuth("bearer")
@Controller("reports")
@UseGuards(FirebaseGuard)
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new report" })
  @ApiCreatedResponse({
    description: "Report created successfully",
    type: ReportResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
  })
  @ApiNotFoundResponse({
    description: "Area of interest not found",
  })
  async create(
    @FirebaseUser() firebaseUser: { uid: string },
    @Body() createDto: CreateReportDto,
  ): Promise<ReportResponseDto> {
    // Get the internal user ID from Firebase UID
    const user = await this.userService.getCurrentUser(firebaseUser.uid);
    return this.reportService.create(user.id, createDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all reports with pagination and filters" })
  @ApiOkResponse({
    description: "List of reports retrieved successfully",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  async findAll(
    @Query() query: ReportQueryDto,
  ): Promise<PaginatedResponse<ReportResponseDto>> {
    return this.reportService.findAll(query);
  }

  @Get("my")
  @ApiOperation({ summary: "Get current user's reports" })
  @ApiOkResponse({
    description: "List of user's reports retrieved successfully",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  async findMyReports(
    @FirebaseUser() firebaseUser: { uid: string },
    @Query() query: ReportQueryDto,
  ): Promise<PaginatedResponse<ReportResponseDto>> {
    const user = await this.userService.getCurrentUser(firebaseUser.uid);
    return this.reportService.findByUser(user.id, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific report by ID" })
  @ApiOkResponse({
    description: "Report retrieved successfully",
    type: ReportResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Report not found",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  async findOne(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ReportResponseDto> {
    return this.reportService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a report" })
  @ApiOkResponse({
    description: "Report updated successfully",
    type: ReportResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Report not found",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
  })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateReportDto,
  ): Promise<ReportResponseDto> {
    return this.reportService.update(id, updateDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a report" })
  @ApiNoContentResponse({
    description: "Report deleted successfully",
  })
  @ApiNotFoundResponse({
    description: "Report not found",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.reportService.remove(id);
  }

  // ==================== Comment Endpoints ====================

  @Post(":reportId/comments")
  @ApiOperation({ summary: "Create a comment on a report" })
  @ApiCreatedResponse({
    description: "Comment created successfully",
    type: CommentResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
  })
  @ApiNotFoundResponse({
    description: "Report not found",
  })
  async createComment(
    @Param("reportId", ParseUUIDPipe) reportId: string,
    @FirebaseUser() firebaseUser: { uid: string },
    @Body() createDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const user = await this.userService.getCurrentUser(firebaseUser.uid);
    return this.reportService.createComment(reportId, user.id, createDto);
  }

  @Get(":reportId/comments")
  @ApiOperation({ summary: "Get all comments for a report" })
  @ApiOkResponse({
    description: "List of comments retrieved successfully",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  @ApiNotFoundResponse({
    description: "Report not found",
  })
  async findComments(
    @Param("reportId", ParseUUIDPipe) reportId: string,
    @Query() query: CommentQueryDto,
  ): Promise<PaginatedResponse<CommentResponseDto>> {
    return this.reportService.findCommentsByReport(reportId, query);
  }

  @Get(":reportId/comments/:commentId")
  @ApiOperation({ summary: "Get a specific comment" })
  @ApiOkResponse({
    description: "Comment retrieved successfully",
    type: CommentResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Report or comment not found",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  async findOneComment(
    @Param("reportId", ParseUUIDPipe) reportId: string,
    @Param("commentId", ParseUUIDPipe) commentId: string,
  ): Promise<CommentResponseDto> {
    return this.reportService.findOneComment(reportId, commentId);
  }

  @Delete(":reportId/comments/:commentId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a comment" })
  @ApiNoContentResponse({
    description: "Comment deleted successfully",
  })
  @ApiNotFoundResponse({
    description: "Report or comment not found",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid or missing authentication token",
  })
  async removeComment(
    @Param("reportId", ParseUUIDPipe) reportId: string,
    @Param("commentId", ParseUUIDPipe) commentId: string,
  ): Promise<void> {
    return this.reportService.removeComment(reportId, commentId);
  }
}
