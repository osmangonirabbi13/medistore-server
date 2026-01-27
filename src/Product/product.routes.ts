import { Router } from "express";
import { ProductController } from "./product.controller";
import auth from "../middlewares/auth";

const router = Router();

router.get("/", ProductController.getAllMedicine);
router.get("/my-medicine", auth("SELLER"), ProductController.getMyMedicine);
router.get("/:id", ProductController.getMedicineById);

export const productRoute: Router = router;
