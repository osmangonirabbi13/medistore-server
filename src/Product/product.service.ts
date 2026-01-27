import { prisma } from "../lib/prisma";
import { MedicineWhereInput } from '../../generated/prisma/models';


const getAllMedicine = async ({
  search,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
    search: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: MedicineWhereInput[] = [];

  
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  
  const allowedSortFields = ["stock", "price", "categoryId", "isActive"];

  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const medicines = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [finalSortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const total = await prisma.medicine.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: medicines,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getMedicineById = async (id: string) => {
  if (!id) throw new Error("Medicine id is required");

  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!medicine) throw new Error("Medicine not found");

  return medicine;
};

export const ProductService = {
  getMedicineById,
  getAllMedicine,
};
