import { Schema, Model, model } from "mongoose";

export interface AdminProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isChangedPassword: boolean;
}

const adminSchema = new Schema<AdminProps, Model<AdminProps>>({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isChangedPassword: { type: Boolean, required: true },
});

const Admin = model<AdminProps>("Admin", adminSchema);

export { Admin };
