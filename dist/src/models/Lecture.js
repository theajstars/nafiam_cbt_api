"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecture = void 0;
const mongoose_1 = require("mongoose");
const LectureSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    courseID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    files: [{ id: String, path: String, name: String, timestamp: Number }],
});
const Lecture = (0, mongoose_1.model)("Lecture", LectureSchema);
exports.Lecture = Lecture;
//# sourceMappingURL=Lecture.js.map