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
    const Cameras = await Camera.find({ isDeleted: false });
    return res
      .status(200)
      .json({ success: true, message: "success get data", data: Cameras });
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

export const updateCameraById = async (req: Request, res: Response) => {
  try {
    const cameraId = req.params.id;
    const updatedData = req.body;
    const updatedCamera = await Camera.findByIdAndUpdate(
      cameraId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedCamera) {
      return res
        .status(404)
        .json({ success: false, message: "Camera not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Camera updated successfully",
      data: updatedCamera,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found comments", error: error });
  }
};

export const deleteCameraById = async (req: Request, res: Response) => {
  try {
    const cameraId = req.params.id;
    const updatedData = req.body;
    const updatedCamera = await Camera.findByIdAndUpdate(
      cameraId,

      { ...updatedData, isShowed: false },
      { new: true, runValidators: true }
    );

    if (!updatedCamera) {
      return res
        .status(404)
        .json({ success: false, message: "Camera not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Camera updated successfully",
      data: updatedCamera,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found comments", error: error });
  }
};

export const deleteCamera = async (req: Request, res: Response) => {
  try {
    const cameraId = req.params.id;
    const updatedData = req.body;
    const updatedCamera = await Camera.findByIdAndUpdate(
      cameraId,

      { ...updatedData, isDeleted: true },
      { new: true, runValidators: true }
    );

    if (!updatedCamera) {
      return res
        .status(404)
        .json({ success: false, message: "Camera not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Camera updated successfully",
      data: updatedCamera,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found comments", error: error });
  }
};

export const activateCameraById = async (req: Request, res: Response) => {
  try {
    const cameraId = req.params.id;
    const updatedData = req.body;
    const updatedCamera = await Camera.findByIdAndUpdate(
      cameraId,

      { ...updatedData, isShowed: true },
      { new: true, runValidators: true }
    );

    if (!updatedCamera) {
      return res
        .status(404)
        .json({ success: false, message: "Camera not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Camera updated successfully",
      data: updatedCamera,
    });
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
      isShowed: true,
      isDeleted: false,
    };
    const camera = createCameraSchema.safeParse(inputData);

    if (!camera.success) {
      console.log("error=>", camera.error.message);
      return res.status(404).json({
        success: false,
        message: "something error when add camera",
      });
    }

    const createdComment = await Camera.create(camera.data);

    return res.status(201).json({
      success: true,
      message: "successfully create camera",
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
