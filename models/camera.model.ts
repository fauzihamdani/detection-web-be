import { Schema, model, Document } from "mongoose";

export interface CameraDoc extends Document {
  name: string;
  rtsp_url: string;
  ipOnvif?: string;
  username?: string;
  password?: string;
  port?: number;
}

const CameraModelModel = new Schema<CameraDoc>({
  name: { type: String, required: true },
  rtsp_url: { type: String, required: true },
  ipOnvif: { type: String, required: false, default: null },
  username: { type: String, required: false, default: null },
  password: { type: String, required: false, default: null },
  port: { type: Number, required: false, default: null },
});

export const Camera = model<CameraDoc>("camera", CameraModelModel);
