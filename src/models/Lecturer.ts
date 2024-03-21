import { Schema, Model, model } from "mongoose";
export type Gender = "male" | "female";
export type LecturerProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  serviceNumber: string;
  rank: string;
  gender: Gender;
  role: "civilian" | "personnel";
  dateCreated: number;
  isChangedPassword: boolean;
};

const lecturerSchema = new Schema<LecturerProps, Model<LecturerProps>>({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  serviceNumber: { type: String, required: true },
  rank: { type: String, required: true },
  gender: { type: String, required: true },
  role: { type: String, required: true },
  dateCreated: { type: Number, required: true },
  isChangedPassword: { type: Boolean, required: true },

  // school: { type: String, required: true },
});

const Lecturer = model<LecturerProps>("Lecturer", lecturerSchema);
export { Lecturer };
