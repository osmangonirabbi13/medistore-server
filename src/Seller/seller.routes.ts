import { Router } from "express";
import { SellerController } from "./seller.controller";
import auth from "../middlewares/auth";

const router = Router();

router.get("/orders", auth("SELLER"), SellerController.getSellerOrders);
router.patch(
  "/orders/:id",
  auth("SELLER"),
  SellerController.updateSellerOrderStatus,
);

router.post("/become-seller", auth(), SellerController.createSeller);

//admin

router.patch("/:userId/approve", auth("ADMIN"), SellerController.approveSeller);

router.get("/requests", auth("ADMIN"), SellerController.getSellerRequest)


router.get("/my-medicines", auth("SELLER"), SellerController.getAllMyMedicine);

router.post("/medicines", auth("SELLER"), SellerController.createMedicine);
router.put("/medicines/:id", auth("SELLER"), SellerController.updateMedicine);
router.delete(
  "/medicines/:id",
  auth("SELLER"),
  SellerController.deleteMedicine,
);

export const sellerRouter: Router = router;
