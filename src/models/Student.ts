import { Schema, model, Model } from "mongoose";

export interface StudentProps {
  firstName: string;
  lastName: string;
  email: string;
  rank:
    | "lance_corporal"
    | "corporal"
    | "sergeant"
    | "staff_sergeant"
    | "warrant officer"
    | "master_warrant_officer";
}

const studentSchema = new Schema<StudentProps, Model<StudentProps>>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
});

const Student = model<StudentProps>("Student", studentSchema);

export { Student };
