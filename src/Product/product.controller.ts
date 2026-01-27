import { Request, Response } from "express";
import { ProductService } from "./product.service";
import paginationSortingHelper from "../helpers/paginationSortingHelper";

const getAllMedicine = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString =
      typeof search === "string" ? search : undefined;

    const { page, limit, skip, sortBy, sortOrder } =
      paginationSortingHelper(req.query);

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
    console.log("GET MEDICINE BY ID HIT");

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

export const ProductController = {
  getMedicineById,
  getAllMedicine
};
