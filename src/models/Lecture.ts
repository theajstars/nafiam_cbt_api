import { Schema, Model, model, Types } from "mongoose";
import { FileProps } from "./File";

export interface LectureProps {
  id: string;
  courseID: string;
  title: string;
  description: string;
  practiceID: string;
  isActive: boolean;
  dateCreated: number;
  files: Types.DocumentArray<FileProps>;
}

const LectureSchema = new Schema<LectureProps, Model<LectureProps>>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  practiceID: { type: String, required: false },
  isActive: { type: Boolean, required: true },
  dateCreated: { type: Number, required: true },
  courseID: { type: String, required: true },
  files: [
    {
      id: String,
      path: String,
      cloudinaryID: String,
      name: String,
      timestamp: Number,
    },
  ],
});

const Lecture = model<LectureProps>("Lecture", LectureSchema);

export { Lecture };
