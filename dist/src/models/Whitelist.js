"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whitelist = void 0;
const mongoose_1 = require("mongoose");
const WhitelistSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    practiceID: { type: String, required: false },
    examinationID: { type: String, required: false },
    students: [{ type: String, required: false }],
    lastUpdated: { type: Number, required: true },
});
const Whitelist = (0, mongoose_1.model)("Whitelist", WhitelistSchema);
exports.Whitelist = Whitelist;
//# sourceMappingURL=Whitelist.js.map