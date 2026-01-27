import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth from "../middlewares/auth";

const router = Router();

router.post("/add-category", auth("SELLER"), CategoryController.createCategory);

router.get("/", CategoryController.getAllCategory);

export const categoryRouter: Router = router;
