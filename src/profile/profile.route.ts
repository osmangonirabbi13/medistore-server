import { Router } from "express";
import auth from "../middlewares/auth";
import { profileController } from "./profile.controller";

const router = Router();

router.get(
  "/me",
  auth("ADMIN", "CUSTOMER", "SELLER"),
  profileController.getMyProfile,
);
router.patch(
  "/me",
  auth("ADMIN", "CUSTOMER", "SELLER"),
  profileController.updateMyProfile,
);

export const profileRouter: Router = router;
