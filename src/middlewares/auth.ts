import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/enums";

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
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      console.log(session);

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required.",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      console.log(user);

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
      next(err);
    }
  };
};

export default auth;
