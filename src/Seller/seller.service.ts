import { Medicine } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

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

export const ServiceController = {
  createMedicine,
  createSeller,
};
