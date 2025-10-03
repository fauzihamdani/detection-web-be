import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().min(3, "Email must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
  reports: z
    .array(z.string().min(24, "Invalid report ID").max(24, "Invalid report ID"))
    .optional(),
  role: z.enum(["user", "admin", "super admin"]),
});

export const loginSchema = z.object({
  email: z.string().min(3, "Email must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
  reports: z
    .array(z.string().min(24, "Invalid report ID").max(24, "Invalid report ID"))
    .optional(),
});
