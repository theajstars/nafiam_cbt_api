import { Schema, model, Model } from "mongoose";

export type CourseProps = {
  id: string;
  instructorID: string;
  title: string;
  code: string;
  school: string;
  description: string;
  students: any;
  active: boolean;
};

const courseSchema = new Schema<CourseProps, Model<CourseProps>>({
  id: { type: String, required: true },
  instructorID: { type: String, required: true },
  title: { type: String, required: true },
  code: { type: String, required: true },
  school: { type: String, required: true },
  description: { type: String, required: true },
  students: { type: Array, required: true },
  active: { type: Boolean, required: false },
});

const Course = model<CourseProps>("Course", courseSchema);

export { Course };
