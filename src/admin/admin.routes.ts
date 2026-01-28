import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../middlewares/auth";

const router = Router();

router.get("/users", adminController.getAllUsers);
router.get("/stats", adminController.getAdminStats);
router.get("/orders", adminController.getAllOrders);
router.get("/orders/:id", adminController.getOrderDetails);
router.patch("/users/:id", auth("ADMIN"), adminController.updateUserBanStatus);

export const adminRoute: Router = router;
