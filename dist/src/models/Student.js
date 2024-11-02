"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    serviceNumber: { type: String, required: false },
    rank: { type: String, required: true },
    unit: { type: String, required: true },
    trade: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    dateCreated: { type: Number, required: true },
    isChangedPassword: { type: Boolean, required: true },
    isNafiam: { type: Boolean, required: false },
});
const Student = (0, mongoose_1.model)("Student", studentSchema);
exports.Student = Student;
//# sourceMappingURL=Student.js.map