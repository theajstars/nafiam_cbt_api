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
export interface BatchProps {
  id: string;
  title: string;
  examinationID: string;
  date: number;
  batchNumber: number;
  duration: string;
  approved: boolean;
  published: boolean;
  started: boolean;
  completed: boolean;
  questions: any;
  students?: any;
  blacklist: any;
  password?: string;
}

const batchSchema = new Schema<BatchProps, Model<BatchProps>>({
  id: { type: String, required: true },
  examinationID: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  date: { type: Number, required: true },
  batchNumber: { type: Number, required: true },

  started: { type: Boolean, required: true },
  approved: { type: Boolean, required: true },
  published: { type: Boolean, required: true },
  completed: { type: Boolean, required: true },
  questions: { type: Array, required: false },

  students: { type: Array, required: false },
  blacklist: { type: Array, required: false },
  password: { type: String, required: false },
});

const Batch = model<BatchProps>("Batch", batchSchema);

export { Batch };
