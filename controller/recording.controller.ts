import { Request, Response } from "express";
import { Recording } from "../models/recording.model";

export const getRecordings = async (req: Request, res: Response) => {
  try {
    const Recordings = await Recording.find();
    return res.status(200).json({
      sucess: true,
      message: "Success get recodings",
      data: Recordings,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "cannot found recodings",
      error: error,
    });
  }
};
