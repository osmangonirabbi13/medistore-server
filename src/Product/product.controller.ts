import { Request, Response } from "express";
import { ProductService } from "./product.service";
import paginationSortingHelper from "../helpers/paginationSortingHelper";

const getAllMedicine = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await ProductService.getAllMedicine({
      search: searchString,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Medicines retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (e: any) {
    return res.status(400).json({
      success: false,
      message: "Failed to retrieve medicines",
      error: e.message,
    });
  }
};

const getMedicineById = async (req: Request, res: Response) => {
  try {
    

    const { id } = req.params;

    const data = await ProductService.getMedicineById(id as string);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    console.log(user);
    if (!user) {
      throw new Error("You are unauthorized !");
    }

    const result = await ProductService.getMyMedicine(user.id as string);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      details: err,
    });
  }
};

export const ProductController = {
  getMedicineById,
  getAllMedicine,
  getMyMedicine,
};
