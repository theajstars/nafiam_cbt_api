import { Schema, Model, model } from "mongoose";

export interface AdminProps {
  id: string;
  name: string;

  serviceNumber: string;
  rank: string;
  dateCreated: number;
  isChangedPassword: boolean;
  password: string;

  superUser: boolean;
}

const adminSchema = new Schema<AdminProps, Model<AdminProps>>({
  id: { type: String, required: true },
  name: { type: String, required: true },

  serviceNumber: { type: String, required: true },
  rank: { type: String, required: true },
  dateCreated: { type: Number, required: true },
  password: { type: String, required: true },

  isChangedPassword: { type: Boolean, required: true },
  superUser: { type: Boolean, required: true },
});

const Admin = model<AdminProps>("Admin", adminSchema);

export { Admin };
