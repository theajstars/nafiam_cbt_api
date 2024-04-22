"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attempt = void 0;
const mongoose_1 = require("mongoose");
const AttemptSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    practiceID: { type: String, required: true },
    studentID: { type: String, required: true },
    score: { type: Number, required: true },
    percent: { type: Number, required: true },
    timestamp: { type: Number, required: true },
});
const Attempt = (0, mongoose_1.model)("Attempt", AttemptSchema);
exports.Attempt = Attempt;
//# sourceMappingURL=Attempt.js.map