import { Schema, Model, model } from "mongoose";

export interface FileProps {
  id: string;
  path: string;
  name: string;
  timestamp: number;
}

const fileSchema = new Schema<FileProps, Model<FileProps>>({
  id: { type: String, required: true },
  path: { type: String, required: true },
  name: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

const File = model<FileProps>("File", fileSchema);

export { File };
