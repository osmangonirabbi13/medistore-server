import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await adminService.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch users",
    });
  }
};

const updateUserBanStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body as { isBanned?: boolean };

    if (typeof isBanned !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isBanned must be true or false",
      });
    }

    const updated = await adminService.updateUserStatus(id as string, isBanned);

    return res.status(200).json({
      success: true,
      message: "User ban status updated",
      data: updated,
    });
  } catch (err: any) {
    const msg = err.message || "Failed to update user";
    const code = msg === "User not found" ? 404 : 400;

    return res.status(code).json({
      success: false,
      message: msg,
    });
  }
};

const getAdminStats = async (req: Request, res: Response) => {
  try {
    const data = await adminService.getStats();

    return res.status(200).json({
      success: true,
      message: "Admin stats fetched",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch stats",
    });
  }
};

const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await adminService.getOrderDetails(id as string);

    return res.status(200).json({
      success: true,
      message: "Order details fetched",
      data: order,
    });
  } catch (err: any) {
    const msg = err.message || "Failed to fetch order details";
    const code = msg === "Order not found" ? 404 : 400;

    return res.status(code).json({
      success: false,
      message: msg,
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllOrders(req.query);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      ...result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch orders",
    });
  }
};

export const adminController = {
  getAllUsers,
  updateUserBanStatus,
  getAdminStats,
  getOrderDetails,
  getAllOrders
};
