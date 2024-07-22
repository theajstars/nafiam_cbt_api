import { Schema, Model, model } from "mongoose";

export type ResultProps = {
  id: string;
  examinationID: string;
  studentID: string;
  firstName: string;
  lastName: string;
  serviceNumber: string;
  grading: {
    marksObtainable: number;
    numberCorrect: number;
    percent: number;
  };
  exam: {
    title: string;
    courseTitle: string;
    date: string;

    questions: any;
    studentQuestions: any;
  };

  attendance: {
    date: number;
  };
};

const resultSchema = new Schema<ResultProps, Model<ResultProps>>({
  id: { type: String, required: true },
  examinationID: { type: String, required: true },
  studentID: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  serviceNumber: { type: String, required: true },
  grading: {
    marksObtainable: { type: Number, required: true },
    numberCorrect: { type: Number, required: true },
    percent: { type: Number, required: true },
  },
  exam: {
    title: { type: String, required: true },
    date: { type: String, required: true },

    questions: { type: Array, required: true },
    studentQuestions: { type: Array, required: true },
  },

  attendance: {
    date: { type: Number, required: true },
  },
});

const Result = model<ResultProps>("Result", resultSchema);

export { Result };
