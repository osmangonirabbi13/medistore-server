-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PLACED';

-- CreateIndex
CREATE INDEX "OrderItem_status_idx" ON "OrderItem"("status");
