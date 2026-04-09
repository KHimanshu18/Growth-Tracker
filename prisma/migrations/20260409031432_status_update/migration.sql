/*
  Warnings:

  - You are about to drop the column `userId` on the `Visitor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Visitor" DROP CONSTRAINT "Visitor_userId_fkey";

-- DropIndex
DROP INDEX "Visitor_userId_key";

-- AlterTable
ALTER TABLE "Visitor" DROP COLUMN "userId";
