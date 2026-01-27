import { Request , Response } from "express"
import { CategoryService } from "./category.service";

export const createCategory = async (req: Request, res: Response) => {
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


export const CategoryController = {
    createCategory,
}