"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const mongoose_1 = require("mongoose");
const attendanceSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    examinationID: { type: String, required: true },
    batchID: { type: String, required: true },
    timestamp: { type: Number, required: true },
    students: { type: Array, required: true },
});
const Attendance = (0, mongoose_1.model)("Attendance", attendanceSchema);
exports.Attendance = Attendance;
//# sourceMappingURL=Attendance.js.map