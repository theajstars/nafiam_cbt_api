"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Examination = void 0;
const mongoose_1 = require("mongoose");
const examinationSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Number, required: true },
    duration: { type: String, required: true },
    approved: { type: Boolean, required: true },
    published: { type: Boolean, required: true },
    started: { type: Boolean, required: true },
    completed: { type: Boolean, required: true },
    questions: { type: Array, required: false },
    selectedQuestions: { type: Array, required: false },
    students: { type: Array, required: false },
    blacklist: { type: Array, required: false },
    password: { type: String, required: false },
});
const Examination = (0, mongoose_1.model)("Examination", examinationSchema);
exports.Examination = Examination;
//# sourceMappingURL=Examination.js.map