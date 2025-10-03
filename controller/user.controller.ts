import { Request, Response } from "express";
import { createUserSchema, loginSchema } from "../shcemas/user.schema";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { error } from "console";
import bcrypt from "bcryptjs";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().populate("reports");

    return res
      .status(200)
      .json({ success: true, message: "success get data", data: users });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found users", error: error });
  }
};

export const register = async (req: Request, res: Response) => {
  const user = createUserSchema.safeParse(req.body);
  if (!user.success) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: user.error });
  }

  try {
    if (user.success) {
      const userExist = await User.findOne({ email: user.data.email });
      if (userExist) {
        return res
          .status(400)
          .json({ success: false, message: "Your account Already exist" });
      }
      const newUser = await User.create(user.data);
      const token = generateToken(newUser?._id as string, newUser.role);

      return res
        .status(201)
        .json({ message: "User registered successfully", token });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "register failed", error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: result.error });
  }

  try {
    const user = await User.findOne({ email: result.data.email });
    if (!user)
      return res
        .status(400)
        .json({ message: "user not found", success: false });
    const isMatch = bcrypt.compare(result.data.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id as string, user.role);
    res
      .status(200)
      .json({
        success: true,
        message: "Login Successfull",
        token,
        userRole: user.role,
      });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "login failed", error: error });
  }
};
