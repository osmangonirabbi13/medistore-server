import { Request, Response } from "express";
import { CheckoutPayload, orderService } from "./order.service";

const getMyCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  const result = await orderService.getMyCart(userId);

  return res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: result,
  });
};

const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { medicineId, quantity = 1 } = req.body;
    if (!medicineId) {
      return res
        .status(400)
        .json({ success: false, message: "medicineId is required" });
    }
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return res
        .status(400)
        .json({ success: false, message: "quantity must be >= 1" });
    }
    const item = await orderService.addToCart(userId, medicineId, qty);

    return res.status(201).json({
      success: true,
      message: "Added to cart",
      data: item,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || "Add to cart failed",
    });
  }
};

const updateCartQuantity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;
    const { action } = req.body as { action: "inc" | "dec" };

    if (action !== "inc" && action !== "dec") {
      return res.status(400).json({
        success: false,
        message: "action must be 'inc' or 'dec'",
      });
    }

    const result = await orderService.updateQuantity(
      userId,
      id as string,
      action,
    );

    if (result.removed) {
      return res.status(200).json({
        success: true,
        message: "Item removed",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: result.item,
    });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const checkout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const payload = req.body as CheckoutPayload;

    if (
      !payload.shippingName ||
      !payload.shippingPhone ||
      !payload.shippingAddressLine1 ||
      !payload.shippingCity
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping info required (name, phone, address, city).",
      });
    }

    const order = await orderService.checkoutFromCart(userId, payload);

    return res.status(201).json({
      success: true,
      message: "Checkout success",
      data: order,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || "Checkout failed",
    });
  }
};

export const orderController = {
  getMyCart,
  addToCart,
  updateCartQuantity,
  checkout,
};
