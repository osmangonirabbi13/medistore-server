import { Router } from "express";
import { orderController } from "./order.controller";
import auth from "../middlewares/auth";

const router = Router();

router.get("/cart", auth(), orderController.getMyCart);

router.post("/", auth(), orderController.addToCart);
router.patch("/:id", auth(), orderController.updateCartQuantity);
router.post("/checkout", auth(), orderController.checkout);

export const orderRouter: Router = router;
