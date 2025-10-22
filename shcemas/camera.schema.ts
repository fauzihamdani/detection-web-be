import { z } from "zod";

export const createCameraSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  rtsp_url: z.string().min(5, "RTSP must be at least 5 characters"),
  ipOnvif: z.string().min(5, "Ip Onvif must be proper formed").optional(),
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .optional(),
  password: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .optional(),
  port: z.number().min(2, "Port must be at least 2 digit").optional(),
  isShowed: z.boolean().optional(),
  isdeleted: z.boolean().optional(),
});
