import { Schema, Model, model, Types } from "mongoose";
import { FileProps } from "./File";

export interface AttemptProps {
  id: string;
  practiceID: string;
  studentID: string;
  score: number;

  timestamp: number;
}

const AttemptSchema = new Schema<AttemptProps, Model<AttemptProps>>({
  id: { type: String, required: true },
  practiceID: { type: String, required: true },
  studentID: { type: String, required: true },
  score: { type: Number, required: true },

  timestamp: { type: Number, required: true },
});

const Attempt = model<AttemptProps>("Attempt", AttemptSchema);

export { Attempt };
