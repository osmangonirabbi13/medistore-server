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

const getStats = async () =>{
    const [
      totalUsers,
      bannedUsers,
      totalOrders,
      totalMedicines,
      totalCategories,
      salesAgg,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.order.count(),
      prisma.medicine.count(),
      prisma.category.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { placedAt: "desc" },
        select: {
          id: true,
          customerId: true,
          status: true,
          total: true,
          placedAt: true,
        },
      }),
    ]);

    const totalSales = salesAgg._sum.total ?? 0;

    return {
      totalUsers,
      bannedUsers,
      activeUsers: totalUsers - bannedUsers,
      totalOrders,
      totalMedicines,
      totalCategories,
      totalSales,
      recentOrders,
    };
  }


export const adminService = {
    getAllUsers,
    updateUserStatus,
    getStats
}
