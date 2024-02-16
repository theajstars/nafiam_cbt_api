import { Schema, Model, model } from "mongoose";

export interface ExaminationProps {
  id: string;
  title: string;
  year: string;
  course: string;
  started: boolean;
  completed: boolean;
}

const examinationSchema = new Schema<ExaminationProps, Model<ExaminationProps>>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: String, required: true },
    course: { type: String, required: true },
    started: { type: Boolean, required: true },
    completed: { type: Boolean, required: true },
  }
);

const Examination = model<ExaminationProps>("Examination", examinationSchema);

export { Examination };
