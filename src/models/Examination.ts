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
  approved: boolean;
  published: boolean;
  started: boolean;
  completed: boolean;
  questions: any;
  selectedQuestions: any;
  password?: string;
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
    selectedQuestions: { type: Array, required: false },
    password: { type: String, required: false },
  }
);

const Examination = model<ExaminationProps>("Examination", examinationSchema);

export { Examination };
