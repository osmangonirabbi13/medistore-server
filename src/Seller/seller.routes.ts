import { Router } from "express";
import { SellerController } from "./seller.controller";
import auth from "../middlewares/auth";

const router = Router();


router.get("/orders" , auth('SELLER') , SellerController.getSellerOrders)
router.patch("/orders/:id" , auth('SELLER') , SellerController.updateSellerOrderStatus)

router.post("/become-seller", auth(), SellerController.createSeller);

//admin

router.get("/admin/sellers", auth(), SellerController.approveSeller );

router.post("/medicines", auth("SELLER"), SellerController.createMedicine);
router.put("/medicines/:id", auth("SELLER"), SellerController.updateMedicine);
router.delete("/medicines/:id", auth("SELLER"), SellerController.deleteMedicine);

export const sellerRouter: Router = router;
