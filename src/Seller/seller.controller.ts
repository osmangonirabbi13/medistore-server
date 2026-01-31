import { Request, Response } from "express";
import { ServiceController } from "./seller.service";
import { UserRole } from "../middlewares/auth";
import { prisma } from "../lib/prisma";
import { SellerRequestStatus } from "../../generated/prisma/enums";

export const createSeller = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { pharmacyName } = req.body as { pharmacyName?: string };

    if (!pharmacyName || pharmacyName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "pharmacyName is required",
      });
    }

    const data = await ServiceController.createSeller(
      userId,
      pharmacyName.trim(),
    );

    return res.status(201).json({
      success: true,
      message: "Seller profile created successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

const createMedicine = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const data = await ServiceController.createMedicine(req.body, userId);
    console.log(data);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateMedicine = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    const data = await ServiceController.updateMedicine(id as string, userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Medicine update failed",
    });
  }
};

const deleteMedicine = async (req : Request , res : Response) =>{
  try {

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    const data = await ServiceController.deleteMedicine(id as string, userId);

    return res.status(200).json({
      success: true,
      message: "Medicine delete successfully",
      data,
    });
    
  } catch (err : any) {
    return res.status(404).json({
      success: false,
      message: err.message || "Medicine Delete failed",
    });
  }
}

const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const data = await ServiceController.getSellerOrders(sellerId);

    return res.status(200).json({
      success: true,
      message: "Seller orders fetched",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch seller orders",
    });
  }
};

const updateSellerOrderStatus = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updated = await ServiceController.updateSellerOrderStatus(
      sellerId,
      id as string,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: updated,
    });
  } catch (err: any) {
    const msg = err.message || "Failed to update";
    const statusCode =
      msg === "Order item not found" ? 404 :
      msg === "Forbidden" ? 403 :
      400;

    return res.status(statusCode).json({
      success: false,
      message: msg,
    });
  }
};

const approveSeller = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id;
    if (!adminId) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (req.user?.role !== UserRole.ADMIN) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { userId } = req.params; 
    if (!userId) return res.status(400).json({ success: false, message: "userId is required" });

    const data = await ServiceController.approveSeller(userId as string, adminId);

    return res.json({
      success: true,
      message: "Seller approved successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

const getAllMyMedicine = async (req:Request , res : Response) =>{
  try {
     const sellerId =
      (req as any)?.user?.id ||
      (req as any)?.auth?.user?.id ||
      (req as any)?.session?.user?.id;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const medicines = await ServiceController.getAllMyMedicine(sellerId);

    return res.status(200).json({
      success: true,
      message: "My medicines fetched successfully",
      data: medicines,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
}


const getSellerRequest  = async (req:Request , res : Response)=>{
  try {
      const statusParam = (req.query.status as string) || "PENDING";

     
      const status = (SellerRequestStatus as any)[statusParam]
        ? (statusParam as SellerRequestStatus)
        : SellerRequestStatus.PENDING;

      const data = await ServiceController.getSellerRequests({ status });

      return res.status(200).json({
        success: true,
        message: "Seller requests fetched",
        data,
      });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch seller requests",
        error: e?.message,
      });
    }
  }



export const SellerController = {
  createMedicine,
  createSeller,
  updateMedicine,
  deleteMedicine,
  getSellerOrders,
  updateSellerOrderStatus,
  approveSeller,
  getAllMyMedicine,
  getSellerRequest
};
