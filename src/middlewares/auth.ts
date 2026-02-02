import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/enums";

export enum UserRole {
  SELLER = "SELLER",
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: Role;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionData = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

  
      const userId = sessionData?.session?.userId || sessionData?.user?.id || null;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }
      const emailVerified = !!sessionData?.user?.emailVerified;

      if (!emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required.",
        });
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      if (user.isBanned) {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned!",
        });
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      };

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission.",
        });
      }

      next();
    } catch (err) {
  
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        error: (err as any)?.message,
      });
    }
  };
};

export default auth;
