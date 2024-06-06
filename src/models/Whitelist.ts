import { Schema, Model, model, Types } from "mongoose";
import { FileProps } from "./File";

export interface WhitelistProps {
  id: string;
  practiceID: string;
  examinationID: string;
  students: any;

  lastUpdated: number;
}

const WhitelistSchema = new Schema<WhitelistProps, Model<WhitelistProps>>({
  id: { type: String, required: true },
  practiceID: { type: String, required: false },
  examinationID: { type: String, required: false },
  students: [{ type: String, required: false }],
  lastUpdated: { type: Number, required: true },
});

const Whitelist = model<WhitelistProps>("Whitelist", WhitelistSchema);

export { Whitelist };
