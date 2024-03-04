import { Schema, Model, model } from "mongoose";

export type QuestionOptionProps = {
  id: string;
  value: string;
  label: string;
};
export type QuestionProps = {
  id: string;
  title: string;
  options: QuestionOptionProps[];
  answer: string;
};
export interface ExaminationProps {
  id: string;
  title: string;
  year: string;
  course: string;
  lecturerID: string;
  started: boolean;
  approved: boolean;
  published: boolean;
  completed: boolean;
  questions: any;
}

const examinationSchema = new Schema<ExaminationProps, Model<ExaminationProps>>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: String, required: true },
    course: { type: String, required: true },
    lecturerID: { type: String, required: true },
    started: { type: Boolean, required: true },
    approved: { type: Boolean, required: true },
    published: { type: Boolean, required: true },
    completed: { type: Boolean, required: true },
    questions: { type: Array, required: false },
  }
);

const Examination = model<ExaminationProps>("Examination", examinationSchema);

export { Examination };
