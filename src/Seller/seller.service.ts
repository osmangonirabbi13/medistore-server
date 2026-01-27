import { Medicine } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

const createMedicine = async (
  data: Omit<Medicine, "id" | "createdAt" | "updatedAt" | "sellerId">,
) => {
  const result = await prisma.medicine.create({
    data: {
      ...data,
      sellerId: "TEMP_SELLER_ID",
    },
  });

  return result;
};

export const ServiceController = {
  createMedicine,
};
