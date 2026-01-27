import { Request, Response } from "express";
import { ServiceController } from "./seller.service";

const createMedicine = async (req: Request, res: Response) => {
  try {
    const data = await ServiceController.createMedicine(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const SellerController = {
  createMedicine,
};
