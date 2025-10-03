import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any; // Add the `user` property here
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer", "").trim();
  if (!token) return res.status(401).json({ message: "Unauthorized __" });

  try {
    const decoded = verifyToken(token) as JwtPayload;
    (req as JwtPayload).user = decoded;
    console.log("decoded => ", decoded);

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized", error: error });
  }
};
