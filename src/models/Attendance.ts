import { Schema, Model, model } from "mongoose";

export interface AttendanceProps {
  id: string;
  examinationID: string;
  batchID: string;
  timestamp: number;
  students: any;
}

const attendanceSchema = new Schema<AttendanceProps, Model<AttendanceProps>>({
  id: { type: String, required: true },
  examinationID: { type: String, required: true },
  batchID: { type: String, required: true },
  timestamp: { type: Number, required: true },
  students: { type: Array, required: true },
});

const Attendance = model<AttendanceProps>("Attendance", attendanceSchema);

export { Attendance };
