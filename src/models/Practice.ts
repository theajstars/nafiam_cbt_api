import { Schema, Model, model, Types } from "mongoose";
import { FileProps } from "./File";

interface OptionProps {
  value: string;
  label: string;
  id: string;
}
interface QuestionProps {
  id: string;
  title: string;
  options: Types.DocumentArray<OptionProps>;
  answer: string;
}
interface PracticeLecture {
  title: string;
  id: string;
}
export interface PracticeProps {
  id: string;
  lecture: PracticeLecture;
  questions: Types.DocumentArray<QuestionProps>;
  dateCreated: number;
}

const PracticeSchema = new Schema<PracticeProps, Model<PracticeProps>>({
  id: { type: String, required: true },
  lecture: {
    title: { type: String, required: true },
    id: { type: String, required: true },
  },
  questions: [
    {
      id: String,
      title: String,
      options: [{ id: String, value: String }],
      answer: String,
    },
  ],
  dateCreated: { type: Number, required: true },
});

const Practice = model<PracticeProps>("Practice", PracticeSchema);

export { Practice };
