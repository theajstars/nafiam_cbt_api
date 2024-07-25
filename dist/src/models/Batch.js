"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = void 0;
const mongoose_1 = require("mongoose");
const batchSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    examinationID: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    date: { type: Number, required: true },
    batchNumber: { type: Number, required: true },
    started: { type: Boolean, required: true },
    approved: { type: Boolean, required: true },
    published: { type: Boolean, required: true },
    completed: { type: Boolean, required: true },
    questions: { type: Array, required: false },
    students: { type: Array, required: false },
    blacklist: { type: Array, required: false },
    password: { type: String, required: false },
});
const Batch = (0, mongoose_1.model)("Batch", batchSchema);
exports.Batch = Batch;
//# sourceMappingURL=Batch.js.map