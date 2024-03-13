import { Schema, model, Model } from "mongoose";
import { Gender } from "./Lecturer";

export interface StudentProps {
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
  // school: string;
}

const studentSchema = new Schema<StudentProps>({
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
  // school: { type: String, required: true },
});

const Student = model<StudentProps>("Student", studentSchema);

export { Student };
