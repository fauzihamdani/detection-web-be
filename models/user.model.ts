import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDoc extends Document {
  email: string;
  password: string;
  reports: Schema.Types.ObjectId;
  role: "user" | "admin" | "super admin";
  createdAt: Date;
  updatedAt: Date;
}

const userModel = new Schema<UserDoc>(
  {
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    reports: [{ type: Schema.Types.ObjectId, ref: "report", default: [] }],
    role: {
      type: String,
      enum: ["user", "admin", "super admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this, (this.password = await bcrypt.hash(this.password, 10));
  next();
});

userModel.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = model<UserDoc>("user", userModel);
