import { prisma } from "../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: false,
      createdAt: true,
    },
  });

  return users;
};


const updateUserStatus = async (
  userId: string,
  isBanned: boolean
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isBanned },
  });

  return updated;
};

export const adminService = {
    getAllUsers,
    updateUserStatus
}
