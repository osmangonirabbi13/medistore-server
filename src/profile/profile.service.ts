import { prisma } from "../lib/prisma";

const getMe = async (userId: string) => {
  console.log(userId);
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const  updateMe = async (   userId: string,
    payload: { name?: string; phone?: string;  })=>{
       return prisma.user.update({
      where: { id: userId },
      data: {
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        emailVerified: true,
        updatedAt: true,
      },
    });
  }


export const profileService = {
  getMe,
  updateMe
};
