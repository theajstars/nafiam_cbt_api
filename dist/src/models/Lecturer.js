"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecturer = void 0;
const mongoose_1 = require("mongoose");
const lecturerSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    serviceNumber: { type: String, required: true },
    // department: { type: String, required: true },
    rank: { type: String, required: true },
    role: { type: String, required: true },
});
const Lecturer = (0, mongoose_1.model)("Lecturer", lecturerSchema);
exports.Lecturer = Lecturer;
//# sourceMappingURL=Lecturer.js.map