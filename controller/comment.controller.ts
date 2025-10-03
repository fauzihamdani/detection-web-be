import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import z from "zod";
import { createCommentSchema } from "../shcemas/comment.schema";
import { Comment } from "../models/comment.model";

type CreateComment = z.infer<typeof createCommentSchema>;

export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find()
      .populate("user", "-password")
      .populate("reportId");

    // if(!comments || comments.length === 0 ){
    //     return res.status(404).json({success:false, message:"no reports found", data:[]})
    // }

    return res
      .status(200)
      .json({ success: true, message: "success get data", data: comments });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found comments", error: error });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as JwtPayload).user.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ success: false, message: "user not found" });
    }
    const inputData: CreateComment = {
      ...req.body,
      user: userId,
      isAdmin: false,
      isRead: false,
    };
    const comment = createCommentSchema.safeParse(inputData);

    const createdComment = await Comment.create(comment.data);

    return res.status(201).json({
      success: true,
      message: "successfully create comment",
      data: createdComment,
    });
  } catch (error) {
    return res
      .status(404)
      .json({
        success: false,
        message: "something error when add comment",
        error: error,
      });
  }
};
