import { Request , Response } from "express"
import { CategoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
  try {
    const data = await CategoryService.createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const data = await CategoryService.getAllCategory();

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};





export const CategoryController = {
    createCategory,
    getAllCategory
}