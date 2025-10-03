import { z } from "zod";

export const createCameraSchema = z.object({
  name: z.string().min(5, "Comment must be at least 5 characters"),
  rtsp_url: z.string().min(5, "Comment must be at least 5 characters"),
});
