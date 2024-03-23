import { Schema, Model, model } from "mongoose";

export interface LogProps {
  id: string;
  personnelID: string;
  userType: "admin" | "student" | "lecturer";
  action: "login" | "change_password";
  timestamp: number;
  navigatorObject: any;
  comments?: string;
}

const logSchema = new Schema<LogProps, Model<LogProps>>({
  id: { type: String, required: true },
  personnelID: { type: String, required: true },
  userType: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Number, required: true },
  navigatorObject: { type: Object, required: true },
  comments: { type: String, required: false },
});

const Log = model<LogProps>("Log", logSchema);

export { Log };
