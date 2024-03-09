import { Schema, Model, model } from "mongoose";

export interface SchoolProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const schoolSchema = new Schema<SchoolProps, Model<SchoolProps>>({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const School = model<SchoolProps>("School", schoolSchema);

export { School };
