import { Medicine, OrderStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

type UpdateMedicinePayload = Prisma.MedicineUpdateInput;

const createSeller = async (userId: string, pharmacyName: string) => {
  console.log(userId);
  return await prisma.sellerProfile.upsert({
    where: { userId },
    update: { pharmacyName },
    create: {
      userId,
      pharmacyName,
    },
  });
};

const createMedicine = async (
  data: Omit<Medicine, "id" | "createdAt" | "updatedAt" | "sellerId">,
  userId: string,
) => {
  if (!userId) {
    throw new Error("Unauthorized: userId missing");
  }

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId },
    select: { id: true, status: true },
  });

  console.log(sellerProfile);

  if (!sellerProfile) {
    throw new Error("Seller profile not found. Please become a seller first.");
  }

  const result = await prisma.medicine.create({
    data: {
      ...data,
      sellerId: userId,
    },
  });
  console.log(result);
  return result;
};

const updateMedicine = async (
  medicineId: string,
  userId: string,
  payload: UpdateMedicinePayload,
) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { id: true, sellerId: true },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  if (medicine.sellerId !== userId) {
    throw new Error("Forbidden! You cannot update this medicine.");
  }

  const { id, sellerId, createdAt, updatedAt, ...safeData } = payload as any;

  const result = await prisma.medicine.update({
    where: { id: medicineId },
    data: safeData,
  });

  return result;
};

const deleteMedicine = async (medicineId: string, userId: string) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { id: true, sellerId: true },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  if (medicine.sellerId !== userId) {
    throw new Error("Forbidden! You cannot delete this medicine.");
  }

  const result = await prisma.medicine.delete({
    where: { id: medicineId },
  });

  return result;
};

const getSellerOrders = async (sellerId: string) => {
  const items = await prisma.orderItem.findMany({
    where: { sellerId },
    include: {
      order: true,
    },
    orderBy: {
      order: { placedAt: "desc" },
    },
  });

  return items;
};

const updateSellerOrderStatus = async (
  sellerId: string,
  orderItemId: string,
  status: OrderStatus,
) => {
  const item = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
  });

  if (!item) throw new Error("Order item not found");

  if (item.sellerId !== sellerId) throw new Error("Forbidden");

  const updated = await prisma.orderItem.update({
    where: { id: orderItemId },
    data: { status },
  });

  return updated;
};

const approveSeller = async(sellerUserId: string, adminId: string) =>{
  return prisma.sellerProfile.update({
      where: { userId: sellerUserId },
      data: {
        status: "APPROVED",
        approvedById: adminId,
        approvedAt: new Date(),
        
      },
    });
}

export const ServiceController = {
  createMedicine,
  createSeller,
  updateMedicine,
  deleteMedicine,
  getSellerOrders,
  updateSellerOrderStatus,
  approveSeller
};
