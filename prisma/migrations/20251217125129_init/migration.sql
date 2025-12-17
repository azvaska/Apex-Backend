-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaOfInterest" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "geometry" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AreaOfInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertPreference" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "areaId" UUID NOT NULL,
    "avalancheThreshold" DOUBLE PRECISION NOT NULL,
    "flood" BOOLEAN NOT NULL,
    "storm" BOOLEAN NOT NULL,
    "landslide" BOOLEAN NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentalSample" (
    "id" UUID NOT NULL,
    "areaId" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "airTemperatureC" DOUBLE PRECISION NOT NULL,
    "relativeHumidity" DOUBLE PRECISION NOT NULL,
    "windSpeedMs" DOUBLE PRECISION NOT NULL,
    "windDirectionDeg" INTEGER NOT NULL,
    "precipitationMm" DOUBLE PRECISION NOT NULL,
    "rawData" JSONB,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvironmentalSample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentalAggregate" (
    "id" UUID NOT NULL,
    "areaId" UUID NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,
    "avalancheLevel" INTEGER NOT NULL,
    "floodLevel" INTEGER NOT NULL,
    "stormLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvironmentalAggregate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertEvent" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "areaId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "riskIndex" INTEGER NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "AlertEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "areaId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttachmentMetadata" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttachmentMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationContext" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "areaId" UUID NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationContext_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIAnswer" (
    "id" UUID NOT NULL,
    "contextId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawMeteoPayload" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "rawJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawMeteoPayload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AlertPreference_areaId_idx" ON "AlertPreference"("areaId");

-- CreateIndex
CREATE UNIQUE INDEX "AlertPreference_userId_areaId_key" ON "AlertPreference"("userId", "areaId");

-- CreateIndex
CREATE INDEX "EnvironmentalSample_areaId_timestamp_idx" ON "EnvironmentalSample"("areaId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "EnvironmentalSample_areaId_timestamp_source_key" ON "EnvironmentalSample"("areaId", "timestamp", "source");

-- CreateIndex
CREATE INDEX "EnvironmentalAggregate_areaId_validFrom_validTo_idx" ON "EnvironmentalAggregate"("areaId", "validFrom", "validTo");

-- CreateIndex
CREATE UNIQUE INDEX "EnvironmentalAggregate_areaId_validFrom_validTo_key" ON "EnvironmentalAggregate"("areaId", "validFrom", "validTo");

-- CreateIndex
CREATE INDEX "AlertEvent_userId_createdAt_idx" ON "AlertEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AlertEvent_areaId_createdAt_idx" ON "AlertEvent"("areaId", "createdAt");

-- CreateIndex
CREATE INDEX "Report_areaId_createdAt_idx" ON "Report"("areaId", "createdAt");

-- CreateIndex
CREATE INDEX "Report_userId_createdAt_idx" ON "Report"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_reportId_createdAt_idx" ON "Comment"("reportId", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_userId_createdAt_idx" ON "Comment"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AttachmentMetadata_reportId_idx" ON "AttachmentMetadata"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationContext_conversationId_key" ON "ConversationContext"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationContext_userId_updatedAt_idx" ON "ConversationContext"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "ConversationContext_areaId_updatedAt_idx" ON "ConversationContext"("areaId", "updatedAt");

-- CreateIndex
CREATE INDEX "AIAnswer_contextId_generatedAt_idx" ON "AIAnswer"("contextId", "generatedAt");

-- CreateIndex
CREATE INDEX "RawMeteoPayload_source_receivedAt_idx" ON "RawMeteoPayload"("source", "receivedAt");

-- AddForeignKey
ALTER TABLE "AlertPreference" ADD CONSTRAINT "AlertPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertPreference" ADD CONSTRAINT "AlertPreference_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "AreaOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentalSample" ADD CONSTRAINT "EnvironmentalSample_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "AreaOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentalAggregate" ADD CONSTRAINT "EnvironmentalAggregate_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "AreaOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertEvent" ADD CONSTRAINT "AlertEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertEvent" ADD CONSTRAINT "AlertEvent_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "AreaOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "AreaOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttachmentMetadata" ADD CONSTRAINT "AttachmentMetadata_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationContext" ADD CONSTRAINT "ConversationContext_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationContext" ADD CONSTRAINT "ConversationContext_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "AreaOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAnswer" ADD CONSTRAINT "AIAnswer_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "ConversationContext"("id") ON DELETE CASCADE ON UPDATE CASCADE;
