import { Schema, Model, model } from "mongoose";
export type Gender = "male" | "female";
export type InstructorProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  password: string;
  serviceNumber: string;
  rank: string;
  gender: Gender;
  role: "civilian" | "personnel";
  dateCreated: number;
  isChangedPassword: boolean;
};

const instructorSchema = new Schema<InstructorProps, Model<InstructorProps>>({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  school: { type: String, required: true },
  password: { type: String, required: true },
  serviceNumber: { type: String, required: false },
  rank: { type: String, required: true },
  gender: { type: String, required: true },
  role: { type: String, required: true },
  dateCreated: { type: Number, required: true },
  isChangedPassword: { type: Boolean, required: true },

  // school: { type: String, required: true },
});

const Instructor = model<InstructorProps>("Instructor", instructorSchema);
export { Instructor };
