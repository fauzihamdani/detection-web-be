import { z } from "zod";

export const createOnvifSchema = z.object({
  ip: z.string().min(5, "check you ip input"),
});
