import { Schema, Model, model } from "mongoose";

export interface AttendanceProps {
  id: string;
  examinationID: string;
  timestamp: string;
  students: any;
}

const attendanceSchema = new Schema<AttendanceProps, Model<AttendanceProps>>({
  id: { type: String, required: true },
  examinationID: { type: String, required: true },
  timestamp: { type: String, required: true },
  students: { type: String, required: true },
});

const Attendance = model<AttendanceProps>("Attendance", attendanceSchema);

export { Attendance };
