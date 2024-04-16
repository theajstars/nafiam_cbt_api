import { Schema, Model, model, Types } from "mongoose";
import { FileProps } from "./File";

interface OptionProps {
  value: string;
  id: string;
}
interface QuestionProps {
  options: Types.DocumentArray<OptionProps>;
  answer: string;
}
export interface PracticeProps {
  id: string;
  lectureID: string;
  questions: Types.DocumentArray<QuestionProps>;
  dateCreated: number;
}

const PracticeSchema = new Schema<PracticeProps, Model<PracticeProps>>({
  id: { type: String, required: true },
  lectureID: { type: String, required: true },
  questions: [{ options: [{ id: String, value: String }], answer: String }],
  dateCreated: { type: Number, required: true },
});

const Practice = model<PracticeProps>("Practice", PracticeSchema);

export { Practice };
