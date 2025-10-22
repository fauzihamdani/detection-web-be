import { Request, Response } from "express";
import {
  createReportSchema,
  updatReportSchema,
} from "../shcemas/report.schema";
import { Report } from "../models/report.model";
import { User } from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";
import z from "zod";

type CreateInput = z.infer<typeof createReportSchema>;
type UpdateInput = z.infer<typeof updatReportSchema>;

export const getReports = async (req: Request, res: Response) => {
  const { isDone } = req.query;
  try {
    const reports = await Report.find()
      .populate("user", "-password")
      .populate("lastUpdateOnProcess")
      .populate("lastUpdateDone");

    // if (!reports || reports.length === 0) {
    //   return res.status(404).json({ success: false, message: "No reports found" });
    // }

    return res
      .status(200)
      .json({ success: true, message: "Success get data", data: reports });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found report", error: error });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as JwtPayload).user.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ success: false, message: "user not found!" });
    }

    const inputData: CreateInput = {
      ...req.body,
      user: userId,
      lastUpdateOnProcess: null,
      lastUpdateDone: null,
    };
    const report = createReportSchema.safeParse(inputData);
    const createdReport = await Report.create(inputData);
    await User.updateOne(
      { _id: userId },
      { $push: { reports: createdReport._id } }
    );

    return res.status(201).json(report);
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found report", error: error });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  const reportId = req.params.id;
  const userId = (req as JwtPayload).user.userId;
  const getOneReport = await Report.findById(reportId);
  const updateData: UpdateInput = {
    ...req.body,
    lastUpdateDone: getOneReport?.lastUpdateDone
      ? getOneReport.lastUpdateDone.toString()
      : null,
    lastUpdateOnProcess: getOneReport?.lastUpdateOnProcess
      ? getOneReport.lastUpdateOnProcess.toString()
      : null,
  };

  const isSameStatus = getOneReport?.status === req.body.status;

  if (req.body.status === "on process") {
    if (updateData.lastUpdateOnProcess !== userId) {
      updateData.lastUpdateOnProcess = updateData.lastUpdateOnProcess;
    }
    updateData.lastUpdateDone = null;
  }

  if (req.body.status === "done") {
    if (getOneReport?.lastUpdateDone !== userId) {
      updateData.lastUpdateDone = userId;
    }
  }

  const reportInput = updatReportSchema.safeParse(updateData);
  if (!reportInput.success) {
    return res.status(400).json({ success: false, message: reportInput.error });
  }

  try {
    const updateReport = await Report.findByIdAndUpdate(
      reportId,
      reportInput.data,
      {
        new: true,
      }
    );
    if (!updateReport) {
      return res
        .status(404)
        .json({ success: false, message: "cannot find report" });
    }

    return res
      .status(201)
      .json({ success: true, message: "success update report" });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found report", error: error });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  const reportId = req.params.id;
  const userId = (req as JwtPayload).user.userId;

  try {
    const updateReport = await Report.findByIdAndDelete(reportId);
    if (!updateReport) {
      return res
        .status(404)
        .json({ success: false, message: "cannot find report" });
    }

    return res
      .status(201)
      .json({ success: true, message: "success delete report" });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: "cannot found report", error: error });
  }
};
