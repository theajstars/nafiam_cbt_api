import { Schema, model, Model } from "mongoose";

export interface StudentProps {
  firstName: string;
  lastName: string;
  email: string;
}

const studentSchema = new Schema<StudentProps, Model<StudentProps>>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
});

const Student = model<StudentProps>("Student", studentSchema);

export { Student };
