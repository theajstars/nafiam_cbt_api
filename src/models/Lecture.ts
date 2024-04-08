import { Schema, Model, model } from "mongoose";

export interface LectureProps {
  id: string;
  courseID: string;
  title: string;
  description: string;
  files: any;
}

const LectureSchema = new Schema<LectureProps, Model<LectureProps>>({
  id: { type: String, required: true },
  courseID: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  files: { type: Array, required: true },
});

const Lecture = model<LectureProps>("Lecture", LectureSchema);

export { Lecture };
