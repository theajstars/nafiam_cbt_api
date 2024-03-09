"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = void 0;
const mongoose_1 = require("mongoose");
const schoolSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    dean: { type: String, required: true },
});
const School = (0, mongoose_1.model)("School", schoolSchema);
exports.School = School;
//# sourceMappingURL=Schools.js.map