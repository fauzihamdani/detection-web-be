import { z } from "zod";

export const createReportSchema = z.object({
  reportContain: z.string().min(3, "Report Text must be at least 3 characters"),
  isDone: z.boolean("done must be boolean value"),
  status: z.enum(["waiting", "on process", "done"]),
  user: z.string().min(24, "user not valid"),
  lastUpdateOnProcess: z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === null || val?.length === 24, {
      message: "the id must be 24 characters",
    })
    .default(null),
  lastUpdateDone: z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === null || val?.length === 24, {
      message: "the id must be 24 characters",
    })
    .default(null),
});

export const updatReportSchema = z.object({
  reportContain: z.string().min(3, "Report Text must be at least 3 characters"),
  isDone: z.boolean("done must be boolean value"),
  status: z.enum(["waiting", "on process", "done"]),
  lastUpdateOnProcess: z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === null || val?.length === 24, {
      message: "the id must be 24 characters",
    })
    .default(null),
  lastUpdateDone: z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === null || val?.length === 24, {
      message: "the id must be 24 characters",
    })
    .default(null),
});
