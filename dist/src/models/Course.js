"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    lecturerID: { type: String, required: true },
    title: { type: String, required: true },
    code: { type: String, required: true },
    school: { type: String, required: true },
    description: { type: String, required: true },
});
const Course = (0, mongoose_1.model)("Course", courseSchema);
exports.Course = Course;
//# sourceMappingURL=Course.js.map