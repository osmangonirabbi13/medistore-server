import { Request, Response } from "express";
import { ServiceController } from "./seller.service";

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

export const SellerController = {
  createMedicine,
  createSeller,
  updateMedicine,
  deleteMedicine,
  getSellerOrders
};
