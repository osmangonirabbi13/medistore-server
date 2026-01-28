import paginationSortingHelper from "../helpers/paginationSortingHelper";
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

const getOrderDetails = async( orderId : string) =>{
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
        items: true, 
      },
    });

    if (!order) throw new Error("Order not found");

    return order;
}

const getAllOrders = async (query: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationSortingHelper(query);

  const where: any = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      { id: { contains: query.search, mode: "insensitive" } },
      { shippingName: { contains: query.search, mode: "insensitive" } },
      { shippingPhone: { contains: query.search, mode: "insensitive" } },
    ];
  }

  
  const allowedSortFields = ["placedAt", "updatedAt", "total", "status"];

  const finalSortBy =
    sortBy && allowedSortFields.includes(String(sortBy))
      ? String(sortBy)
      : "placedAt"; 

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [finalSortBy]: sortOrder },
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: orders,
  };
};


export const adminService = {
    getAllUsers,
    updateUserStatus,
    getStats,
    getOrderDetails,
    getAllOrders
}
