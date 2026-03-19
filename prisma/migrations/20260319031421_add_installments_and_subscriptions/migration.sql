/*
  Warnings:

  - You are about to drop the column `amount` on the `Debt` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Debt` table. All the data in the column will be lost.
  - You are about to drop the column `interest` on the `Debt` table. All the data in the column will be lost.
  - Added the required column `amountPerMonth` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installmentNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "closingDay" INTEGER,
ADD COLUMN     "dueDay" INTEGER,
ADD COLUMN     "monthlyLimit" DOUBLE PRECISION,
ALTER COLUMN "color" SET DEFAULT '#7c3aed';

-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "amount",
DROP COLUMN "dueDate",
DROP COLUMN "interest",
ADD COLUMN     "amountPerMonth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Otros',
ADD COLUMN     "isSubscription" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalInstallments" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "installmentNumber" INTEGER NOT NULL;
