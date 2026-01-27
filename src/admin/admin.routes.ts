import { Router } from "express";
import { adminController } from "./admin.controller";


const router = Router()

router.get("/users" , adminController.getAllUsers)
router.patch("/users/:id" , adminController.updateUserBanStatus)


export const adminRoute : Router = router