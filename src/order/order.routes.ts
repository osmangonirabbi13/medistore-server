import { Router } from "express";
import { orderController } from "./order.controller";
import auth from "../middlewares/auth";

const router = Router();

router.get("/cart", auth("CUSTOMER"), orderController.getMyCart);

router.post("/", auth("CUSTOMER"), orderController.addToCart);
router.patch("/:id", auth("CUSTOMER"), orderController.updateCartQuantity);
router.post("/checkout", auth("CUSTOMER"), orderController.checkout);

router.get("/my-orders", auth(), orderController.getMyOrders);

router.get("/:id", auth(), orderController.getOrderDetails);
router.delete("/:id", auth(), orderController.removeFromCart);

export const orderRouter: Router = router;
