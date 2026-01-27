import { Router } from "express";
import { ProductController } from "./product.controller";



const router = Router();


router.get("/" , ProductController.getAllMedicine)
router.get("/:id", ProductController.getMedicineById );

export const productRoute: Router = router;