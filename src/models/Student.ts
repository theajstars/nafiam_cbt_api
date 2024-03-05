import { Schema, model, Model } from "mongoose";

export interface StudentProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rank: "string";
  serviceNumber: "string";
}

const studentSchema = new Schema<StudentProps>({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  rank: { type: String, required: true },
  serviceNumber: { type: String, required: true },
});

const Student = model<StudentProps>("Student", studentSchema);

export { Student };
