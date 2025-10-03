import { Schema, model, Document } from "mongoose";

export interface CommentDoc extends Document {
  comment: string;
  user: Schema.Types.ObjectId;
  isAdmin: boolean;
  isRead: boolean;
  reportId: Schema.Types.ObjectId;
}

const CommentModel = new Schema<CommentDoc>({
  comment: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  isAdmin: { type: Boolean, require: true },
  isRead: { type: Boolean, require: true },
  reportId: { type: Schema.Types.ObjectId, ref: "report", required: true },
});

export const Comment = model<CommentDoc>("comment", CommentModel);
