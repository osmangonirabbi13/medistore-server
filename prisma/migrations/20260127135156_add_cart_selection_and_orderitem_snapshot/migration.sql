/*
  Warnings:

  - Added the required column `medicineName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_medicineId_fkey";

-- DropIndex
DROP INDEX "Cart_userId_idx";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "isSelected" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "medicineName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "CartItem_cartId_isSelected_idx" ON "CartItem"("cartId", "isSelected");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
