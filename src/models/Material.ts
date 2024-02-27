import { Schema, Model, model } from "mongoose";

export interface MaterialProps {
  id: string;
  courseID: string;
  title: string;
  description: string;
  type: string;
  category: string;
  file: string;
}

const materialSchema = new Schema<MaterialProps, Model<MaterialProps>>({
  id: { type: String, required: true },
  courseID: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  file: { type: String, required: true },
});

const Material = model<MaterialProps>("Material", materialSchema);

export { Material };
