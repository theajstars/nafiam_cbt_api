"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instructor = void 0;
const mongoose_1 = require("mongoose");
const instructorSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    school: { type: String, required: true },
    password: { type: String, required: true },
    serviceNumber: { type: String, required: false },
    rank: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    dateCreated: { type: Number, required: true },
    isChangedPassword: { type: Boolean, required: true },
    // school: { type: String, required: true },
});
const Instructor = (0, mongoose_1.model)("Instructor", instructorSchema);
exports.Instructor = Instructor;
//# sourceMappingURL=Instructor.js.map