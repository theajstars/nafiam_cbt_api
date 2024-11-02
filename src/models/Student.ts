import { Schema, model, Model } from "mongoose";
import { Gender } from "./Instructor";

export interface StudentProps {
  id: string;
  name: string;
  password: string;
  serviceNumber: string;
  rank: string;
  unit: string;
  trade: string;
  gender: Gender;
  role: "civilian" | "personnel";
  dateCreated: number;
  isChangedPassword: boolean;
  isNafiam: boolean;
}

const studentSchema = new Schema<StudentProps>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  serviceNumber: { type: String, required: false },
  rank: { type: String, required: true },
  unit: { type: String, required: true },
  trade: { type: String, required: true },
  gender: { type: String, required: true },
  role: { type: String, required: true },
  dateCreated: { type: Number, required: true },
  isChangedPassword: { type: Boolean, required: true },
  isNafiam: { type: Boolean, required: false },
});

const Student = model<StudentProps>("Student", studentSchema);

export { Student };
