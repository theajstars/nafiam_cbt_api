import { Schema, Model, model, Types } from "mongoose";
import { FileProps } from "./File";

export interface LectureProps {
  id: string;
  courseID: string;
  title: string;
  description: string;
  files: Types.DocumentArray<FileProps>;
}

const LectureSchema = new Schema<LectureProps, Model<LectureProps>>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  courseID: { type: String, required: true },
  files: [{ id: String, path: String, name: String, timestamp: Number }],
});

const Lecture = model<LectureProps>("Lecture", LectureSchema);

export { Lecture };
