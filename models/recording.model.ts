import { Schema, model, Document, Types } from "mongoose";

export interface RecordingDoc extends Document {
  camera_id: Types.ObjectId;
  filename: string;
  path: string;
  createAt: Date;
}

const RecordingModel = new Schema<RecordingDoc>(
  {
    camera_id: {
      type: Schema.ObjectId,
      ref: "camera",
      required: true,
      index: true,
    },
    filename: { type: String, required: true },
    path: { type: String, required: true },
  },
  { timestamps: true }
);

export const Recording = model<RecordingDoc>("recordings", RecordingModel);
