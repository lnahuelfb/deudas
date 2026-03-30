/*
  Warnings:

  - You are about to drop the column `purchaseDate` on the `Debt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "purchaseDate",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "totalAmount" DROP NOT NULL;
