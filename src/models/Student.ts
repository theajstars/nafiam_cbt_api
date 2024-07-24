import { Schema, model, Model } from "mongoose";
import { Gender } from "./Instructor";

export interface StudentProps {
  id: string;
  name: string;
  serviceNumber: string;
  rank: string;
  unit: string;
  trade: string;
  role: "civilian" | "personnel";
  dateCreated: number;
  batch: number;
}

const studentSchema = new Schema<StudentProps>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  serviceNumber: { type: String, required: true },
  rank: { type: String, required: true },
  unit: { type: String, required: true },
  trade: { type: String, required: true },
  role: { type: String, required: true },
  dateCreated: { type: Number, required: true },
  batch: { type: Number, required: true },
});

const Student = model<StudentProps>("Student", studentSchema);

export { Student };
