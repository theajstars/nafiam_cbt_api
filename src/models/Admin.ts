import { Schema, Model, model } from "mongoose";

export interface AdminProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const adminSchema = new Schema<AdminProps, Model<AdminProps>>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const Admin = model<AdminProps>("Admin", adminSchema);

export { Admin };
