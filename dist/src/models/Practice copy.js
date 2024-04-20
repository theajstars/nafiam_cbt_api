"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Practice = void 0;
const mongoose_1 = require("mongoose");
const PracticeSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    lecture: {
        title: { type: String, required: true },
        id: { type: String, required: true },
    },
    questions: [
        {
            id: String,
            title: String,
            options: [{ id: String, value: String }],
            answer: String,
        },
    ],
    dateCreated: { type: Number, required: true },
});
const Practice = (0, mongoose_1.model)("Practice", PracticeSchema);
exports.Practice = Practice;
//# sourceMappingURL=Practice%20copy.js.map