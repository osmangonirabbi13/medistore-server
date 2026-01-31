import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../middlewares/auth";

const router = Router();

router.get("/users",auth("ADMIN") ,  adminController.getAllUsers);
router.get("/stats",auth("ADMIN") , adminController.getAdminStats);
router.get("/orders",auth("ADMIN") , adminController.getAllOrders);
router.get("/orders/:id",auth("ADMIN") , adminController.getOrderDetails);
router.patch("/users/:id", auth("ADMIN"), adminController.updateUserBanStatus);

export const adminRoute: Router = router;
