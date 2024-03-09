import { Schema, Model, model } from "mongoose";

export interface SchoolProps {
  id: string;
  name: string;
  dean: string;
}

const schoolSchema = new Schema<SchoolProps, Model<SchoolProps>>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  dean: { type: String, required: true },
});

const School = model<SchoolProps>("School", schoolSchema);

export { School };
