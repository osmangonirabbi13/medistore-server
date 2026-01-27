
import { prisma } from "../lib/prisma";

export type CreateCategoryInput = {
  name: string;
  description?: string;
};

const createCategory = async (payload: CreateCategoryInput) => {
  const name = payload.name?.trim();
  if (!name) throw new Error("Category name is required");

  
  const exists = await prisma.category.findUnique({ where: { name } });
  if (exists) throw new Error("Category name already exists");

  return await prisma.category.create({
    data: {
      name,
      description: payload.description?.trim() || null,
    },
  });
};

const getAllCategory = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategory
};
