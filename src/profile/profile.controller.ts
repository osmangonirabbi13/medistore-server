import { Request, Response } from "express";
import { profileService } from "./profile.service";

const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    console.log(userId);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const data = await profileService.getMe(userId);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { name, phone } = req.body;

    if (name !== undefined && name.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "name cannot be empty" });
    }

    const data = await profileService.updateMe(userId, {
      name: name?.trim(),
      phone: phone?.trim(),
    });

    return res.json({ success: true, message: "Profile updated", data });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: error?.message,
      });
  }
};

export const profileController = {
  getMyProfile,
  updateMyProfile,
};
