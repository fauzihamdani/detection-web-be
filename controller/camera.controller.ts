import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import z from "zod";
import { createCommentSchema } from "../shcemas/comment.schema";
import { Comment } from "../models/comment.model";
import { Camera } from "../models/camera.model";
import { createCameraSchema } from "../shcemas/camera.schema";

type CreateCamera = z.infer<typeof createCameraSchema>;

export const getCamera = async (req: Request, res: Response) => {
  try {
    const comments = await Camera.find()
      .populate("user", "-password")
      .populate("reportId");

    return res
      .status(200)
      .json({ success: true, message: "success get data", data: comments });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found comments", error: error });
  }
};

export const getCameraById = async (req: Request, res: Response) => {
  try {
    const cameraId = req.params.id;
    const getOneCamera = await Camera.findById(cameraId);

    return res
      .status(200)
      .json({ success: true, message: "success get data", data: getOneCamera });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found comments", error: error });
  }
};

export const createCamera = async (req: Request, res: Response) => {
  try {
    const inputData: CreateCamera = {
      ...req.body,
    };
    const comment = createCameraSchema.safeParse(inputData);

    const createdComment = await Camera.create(comment.data);

    return res.status(201).json({
      success: true,
      message: "successfully create comment",
      data: createdComment,
    });
  } catch (error) {
    console.log("error =>", error);
    return res.status(404).json({
      success: false,
      message: "something error when add camera",
      error: error,
    });
  }
};
