import { Router } from "express";
import { SellerController } from "./seller.controller";


const router = Router()

router.post("/medicines" , SellerController.createMedicine)


export const sellerRouter: Router = router;