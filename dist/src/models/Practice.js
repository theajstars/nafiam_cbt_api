"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Practice = void 0;
const mongoose_1 = require("mongoose");
const PracticeSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    lectureID: { type: String, required: true },
    questions: [{ options: [{ id: String, value: String }], answer: String }],
    dateCreated: { type: Number, required: true },
});
const Practice = (0, mongoose_1.model)("Practice", PracticeSchema);
exports.Practice = Practice;
//# sourceMappingURL=Practice.js.map