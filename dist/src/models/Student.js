"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    serviceNumber: { type: String, required: true },
    rank: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    // department: { type: String, required: true },
});
const Student = (0, mongoose_1.model)("Student", studentSchema);
exports.Student = Student;
//# sourceMappingURL=Student.js.map