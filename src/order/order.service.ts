import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export type CheckoutPayload = {
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  paymentMethod?: "COD" ;
};

const getMyCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { medicine: true },
      },
    },
  });

  return cart;
};

const addToCart = async (
  userId: string,
  medicineId: string,
  quantity: number = 1,
) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { id: true, isActive: true },
  });

  if (!medicine || !medicine.isActive) {
    throw new Error("Medicine not found or not available");
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  const item = await prisma.cartItem.upsert({
    where: {
      cartId_medicineId: { cartId: cart.id, medicineId },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      medicineId,
      quantity,
    },
    include: { medicine: true },
  });

  return item;
};

const updateQuantity = async (
  userId: string,
  cartItemId: string,
  action: "inc" | "dec",
) => {
  if (action !== "inc" && action !== "dec") {
    throw new Error("Invalid action. Use 'inc' or 'dec'.");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (cartItem.cart.userId !== userId) {
    throw new Error("Forbidden");
  }

  const newQty =
    action === "inc" ? cartItem.quantity + 1 : cartItem.quantity - 1;

  if (newQty < 1) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return { removed: true, item: null };
  }

  const updated = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: newQty },
    include: { medicine: true },
  });

  return { removed: false, item: updated };
};

const checkoutFromCart = async (userId: string, payload: CheckoutPayload) => {

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { medicine: true } },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

 
  let subtotal = new Prisma.Decimal(0);

  const orderItems = cart.items.map((ci) => {
    const m = ci.medicine;

    if (!m.isActive) throw new Error(`${m.name} is not available`);
    if (m.stock < ci.quantity) throw new Error(`${m.name} out of stock`);

    const unitPrice = m.price;
    const lineTotal = unitPrice.mul(ci.quantity);

    subtotal = subtotal.add(lineTotal);

    return {
      medicineId: m.id,
      sellerId: m.sellerId,
      quantity: ci.quantity,
      unitPrice,
      lineTotal,

      medicineName: m.name,
      imageUrl: m.imageUrl ?? null,
    };
  });

  const shippingFee = new Prisma.Decimal(0);
  const total = subtotal.add(shippingFee);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerId: userId,
        status: "PLACED",
        paymentMethod: payload.paymentMethod ?? "COD",

        subtotal,
        shippingFee,
        total,

        shippingName: payload.shippingName,
        shippingPhone: payload.shippingPhone,
        shippingAddressLine1: payload.shippingAddressLine1,
        shippingAddressLine2: payload.shippingAddressLine2 ?? null,
        shippingCity: payload.shippingCity,
        shippingPostalCode: payload.shippingPostalCode ?? null,
        shippingCountry: payload.shippingCountry ?? "Bangladesh",

        items: { create: orderItems },
      },
      include: { items: true },
    });
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return created;
  });

  return order;
};

const getOrderDetails = async(userId: string, orderId: string)=>{
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    if (!order) throw new Error("Order not found");

   
    if (order.customerId !== userId) throw new Error("Forbidden");

    return order;
}

export const orderService = {
  getMyCart,
  addToCart,
  updateQuantity,
  checkoutFromCart,
  getOrderDetails
};
