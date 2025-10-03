import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any; // Add the `user` property here
}

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = verifyToken(token) as JwtPayload;
    (req as JwtPayload).user = decoded;

    console.log(decoded);

    if (decoded.role !== "admin" || decoded.role !== "super admin") {
      return res
        .status(401)
        .json({ success: false, message: "You cannot access this service" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
