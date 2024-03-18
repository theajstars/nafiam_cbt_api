"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const mongoose_1 = require("mongoose");
const resultSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    examinationID: { type: String, required: true },
    studentID: { type: String, required: true },
    grading: {
        marksObtainable: { type: Number, required: true },
        numberCorrect: { type: Number, required: true },
        percent: { type: Number, required: true },
    },
    exam: {
        title: { type: String, required: true },
        courseTitle: { type: String, required: true },
        year: { type: String, required: true },
    },
    course: {
        title: { type: String, required: true },
        code: { type: String, required: true },
        school: { type: String, required: true },
    },
    attendance: {
        date: { type: Number, required: true },
    },
});
const Result = (0, mongoose_1.model)("Result", resultSchema);
exports.Result = Result;
//# sourceMappingURL=Results.js.map