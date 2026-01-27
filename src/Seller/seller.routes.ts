import { Router } from "express";
import { SellerController } from "./seller.controller";
import auth from "../middlewares/auth";


const router = Router()

router.post("/become-seller" ,auth(), SellerController.createSeller)

router.post("/medicines" ,auth("SELLER"), SellerController.createMedicine)


export const sellerRouter: Router = router;