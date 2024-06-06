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
  date: number;
  course: string;
  courseTitle: string;
  instructorID: string;
  approved: boolean;
  published: boolean;
  started: boolean;
  completed: boolean;
  questions: any;
  selectedQuestions: any;
  students?: any;
  blacklist: any;
  password?: string;
}

const examinationSchema = new Schema<ExaminationProps, Model<ExaminationProps>>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Number, required: true },
    course: { type: String, required: true },
    courseTitle: { type: String, required: true },
    instructorID: { type: String, required: true },
    started: { type: Boolean, required: true },
    approved: { type: Boolean, required: true },
    published: { type: Boolean, required: true },
    completed: { type: Boolean, required: true },
    questions: { type: Array, required: false },
    selectedQuestions: { type: Array, required: false },
    students: { type: Array, required: false },
    blacklist: { type: Array, required: false },
    password: { type: String, required: false },
  }
);

const Examination = model<ExaminationProps>("Examination", examinationSchema);

export { Examination };
