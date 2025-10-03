import { Schema, model, Document } from "mongoose";

export interface CameraDoc extends Document {
  name: string;
  rtsp_url: string;
}

const CameraModelModel = new Schema<CameraDoc>({
  name: { type: String, required: true },
  rtsp_url: { type: String, required: true },
});

export const Camera = model<CameraDoc>("camera", CameraModelModel);
