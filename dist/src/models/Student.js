"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    id: { type: String, required: false },
    name: { type: String, required: false },
    serviceNumber: { type: String, required: false },
    rank: { type: String, required: false },
    unit: { type: String, required: false },
    trade: { type: String, required: false },
    role: { type: String, required: false },
    dateCreated: { type: Number, required: false },
    batch: { type: Number, required: false },
});
const Student = (0, mongoose_1.model)("Student", studentSchema);
exports.Student = Student;
//# sourceMappingURL=Student.js.map