import { Schema, model, Model } from "mongoose";

export interface CourseProps {
  id: string;
  title: string;
  code: string;
  department: string;
  description: string;
}

const courseSchema = new Schema<CourseProps, Model<CourseProps>>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  code: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
});

const Course = model<CourseProps>("Course", courseSchema);

export { Course };
