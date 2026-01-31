import { Medicine, OrderStatus, Prisma, Role, SellerRequestStatus } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";


type UpdateMedicinePayload = Prisma.MedicineUpdateInput;

type GetSellerRequestsPayload = {
  status?: SellerRequestStatus;
};


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
      medicine: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
        },
      },
      order: {
        select: {
          id: true,
          placedAt: true,
          customer: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      },
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
  return await prisma.$transaction(async (tx) => {
    const item = await tx.orderItem.findUnique({
      where: { id: orderItemId },
      select: { id: true, sellerId: true, orderId: true },
    });

    if (!item) throw new Error("Order item not found");
    if (item.sellerId !== sellerId) throw new Error("Forbidden");

    
    const updated = await tx.orderItem.update({
      where: { id: orderItemId },
      data: { status },
    });

   
    const all = await tx.orderItem.findMany({
      where: { orderId: item.orderId },
      select: { status: true },
    });

    const unique = [...new Set(all.map((x) => x.status))];

    await tx.order.update({
      where: { id: item.orderId },
      data: {
        status: (unique.length === 1 ? unique[0] : "PROCESSING") as OrderStatus,
      },
    });

    return updated;
  });
};

const approveSeller = async (sellerUserId: string, adminId: string) => {
  return prisma.$transaction(async (tx) => {
    const profile = await tx.sellerProfile.update({
      where: { userId: sellerUserId },
      data: {
        status: SellerRequestStatus.APPROVED,
        approvedById: adminId,
        approvedAt: new Date(),
      },
    });

   
    await tx.user.update({
      where: { id: sellerUserId },
      data: { role: Role.SELLER },
    });

    return profile;
  });
};

const getAllMyMedicine = async (sellerId: string) => {
  const medicines = await prisma.medicine.findMany({
    where: { sellerId },
    include: {
      category: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return medicines;
};

const getSellerRequests = async (payload: GetSellerRequestsPayload)=>{
  const status = payload.status ?? SellerRequestStatus.PENDING;

    const data = await prisma.sellerProfile.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      select: {
        userId: true,
        pharmacyName: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return data;
  }




export const ServiceController = {
  createMedicine,
  createSeller,
  updateMedicine,
  deleteMedicine,
  getSellerOrders,
  updateSellerOrderStatus,
  approveSeller,
  getAllMyMedicine,
  getSellerRequests
};
