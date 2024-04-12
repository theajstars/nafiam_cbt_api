"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const mongoose_1 = require("mongoose");
const fileSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    path: { type: String, required: true },
    name: { type: String, required: true },
    cloudinaryID: { type: String, required: true },
    timestamp: { type: Number, required: true },
});
const File = (0, mongoose_1.model)("File", fileSchema);
exports.File = File;
//# sourceMappingURL=File.js.map