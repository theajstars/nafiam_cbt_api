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
  id: { type: String, required: false },
  name: { type: String, required: false },
  serviceNumber: { type: String, required: false },
  rank: { type: String, required: false },
  unit: { type: String, required: false },
  trade: { type: String, required: false },
  role: { type: String, required: false },
  dateCreated: { type: Number, required: false },
  batch: { type: Number, required: false },
});

const Student = model<StudentProps>("Student", studentSchema);

export { Student };
