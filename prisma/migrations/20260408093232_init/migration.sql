-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VISITOR');

-- CreateEnum
CREATE TYPE "ExpressionOfInterest" AS ENUM ('YES', 'NO', 'MAYBE');

-- CreateEnum
CREATE TYPE "VisitorStatus" AS ENUM ('NEW', 'PENDING', 'INTERESTED', 'MAYBE_LATER', 'JOINED', 'REJECTED', 'CATEGORY_CLASH', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VISITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfVisit" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,
    "emailAddress" TEXT,
    "eoi" "ExpressionOfInterest" NOT NULL,
    "invitedBy" TEXT,
    "categoryClash" BOOLEAN NOT NULL DEFAULT false,
    "status" "VisitorStatus" NOT NULL DEFAULT 'NEW',
    "assignedToId" INTEGER,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" SERIAL NOT NULL,
    "visitorId" INTEGER NOT NULL,
    "byId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "feedback" TEXT NOT NULL,
    "nextFollowUpDate" TIMESTAMP(3),
    "status" "VisitorStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_userId_key" ON "Visitor"("userId");

-- CreateIndex
CREATE INDEX "Visitor_status_idx" ON "Visitor"("status");

-- CreateIndex
CREATE INDEX "Visitor_assignedToId_idx" ON "Visitor"("assignedToId");

-- CreateIndex
CREATE INDEX "Visitor_dateOfVisit_idx" ON "Visitor"("dateOfVisit");

-- CreateIndex
CREATE INDEX "Visitor_mobileNo_idx" ON "Visitor"("mobileNo");

-- CreateIndex
CREATE INDEX "Visitor_emailAddress_idx" ON "Visitor"("emailAddress");

-- CreateIndex
CREATE INDEX "FollowUp_visitorId_idx" ON "FollowUp"("visitorId");

-- CreateIndex
CREATE INDEX "FollowUp_byId_idx" ON "FollowUp"("byId");

-- CreateIndex
CREATE INDEX "FollowUp_status_idx" ON "FollowUp"("status");

-- CreateIndex
CREATE INDEX "FollowUp_nextFollowUpDate_idx" ON "FollowUp"("nextFollowUpDate");

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_byId_fkey" FOREIGN KEY ("byId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
