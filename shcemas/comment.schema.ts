import { z } from "zod";

export const createCommentSchema = z.object({
  comment: z.string().min(5, "Comment must be at least 5 characters"),
  user: z.string().min(24, "user not valid"),
  isAdmin: z.boolean("isadmin must be bolean"),
  isRead: z.boolean("is read must be boolean"),
  reportId: z.string().min(24, "user not valid"),
});
