import { Schema, model } from "mongoose";

interface StudentProps {
  firstName: string;
  lastName: string;
  email: string;
}

const studentSchema = new Schema<StudentProps>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
});

const Student = model<StudentProps>("Student", studentSchema);

export { Student };
