import { Schema, model, Model } from "mongoose";

export interface StudentProps {
  id: string;
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

const studentSchema = new Schema<StudentProps>({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
});

const Student = model<StudentProps>("Student", studentSchema);

export { Student };
