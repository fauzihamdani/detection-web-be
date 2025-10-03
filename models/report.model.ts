import { Schema, model, Document } from "mongoose";

export interface ReportDoc extends Document {
  reportContain: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: Schema.Types.ObjectId;
  status: "waiting" | "on process" | "done";
  lastUpdateOnProcess: Schema.Types.ObjectId | null;
  lastUpdateDone: Schema.Types.ObjectId | null;
}

const ReportModel = new Schema<ReportDoc>(
  {
    reportContain: { type: String, required: true, trim: true },
    isDone: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    status: {
      type: String,
      enum: ["waiting", "on process", "done"],
      default: "waiting",
    },
    lastUpdateOnProcess: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: false,
      default: null,
    },
    lastUpdateDone: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: false,
      default: null,
    },
  },

  { timestamps: true }
);

export const Report = model<ReportDoc>("report", ReportModel);
