import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import z from "zod";
import { createCommentSchema } from "../shcemas/comment.schema";
import { Comment } from "../models/comment.model";
import { Camera } from "../models/camera.model";
import { createCameraSchema } from "../shcemas/camera.schema";
import fs from "fs";
import path from "path";

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
      .json({ success: false, message: "cannot found cameras", error: error });
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

export const deactivateCameraById = async (req: Request, res: Response) => {
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

export const updateIsRecording = async (req: Request, res: Response) => {
  try {
    const cameraId = req.params.id;
    const updatedData = req.body;
    const updatedCamera = await Camera.findByIdAndUpdate(
      cameraId,

      { ...updatedData, isRecording: true },
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
      // isRecording: false,
    };
    console.log("inputData => ", inputData);
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

export const getRecording = async (req: Request, res: Response) => {
  try {
    const VIDEO_DIR = process.env.VIDEO_DIR || "/Users/mac/records";
    const nameParam = req.params.name;

    // Amankan nama file (hindari path traversal) & wajib .mp4
    const safeName = path.basename(nameParam);
    if (path.extname(safeName).toLowerCase() !== ".mp4") {
      return res
        .status(400)
        .json({ success: false, message: "Only .mp4 files are allowed." });
    }

    const filePath = path.join(VIDEO_DIR, safeName);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return res
          .status(404)
          .json({ success: false, message: "Video not found." });
      }

      const fileSize = stats.size;
      const range = req.headers.range;
      const contentType = "video/mp4";

      // Tanpa Range → kirim full (beberapa player tetap ok, tapi lebih baik dengan Range)
      if (!range) {
        res.writeHead(200, {
          "Content-Type": contentType,
          "Content-Length": fileSize,
          "Accept-Ranges": "bytes",
          "Content-Disposition": `inline; filename="${safeName}"`,
          "Cache-Control": "public, max-age=3600",
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      // Dengan Range → partial content (seekable)
      const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
      const start = parseInt(startStr, 10);
      const end = endStr
        ? Math.min(parseInt(endStr, 10), fileSize - 1)
        : fileSize - 1;

      if (Number.isNaN(start) || start < 0 || start >= fileSize) {
        res.status(416).set("Content-Range", `bytes */${fileSize}`).end();
        return;
      }

      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${safeName}"`,
        "Cache-Control": "public, max-age=3600",
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to stream video." });
  }
};
