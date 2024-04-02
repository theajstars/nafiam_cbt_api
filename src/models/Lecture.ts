import { Schema, Model, model } from "mongoose";

export interface LectureProps {
  id: string;
  courseID: string;
  title: string;
  file: string;
}

const LectureSchema = new Schema<LectureProps, Model<LectureProps>>({
  id: { type: String, required: true },
  courseID: { type: String, required: true },
  title: { type: String, required: true },
  file: { type: String, required: true },
});

const Lecture = model<LectureProps>("Lecture", LectureSchema);

export { Lecture };
