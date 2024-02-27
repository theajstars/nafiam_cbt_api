"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = void 0;
const mongoose_1 = require("mongoose");
const materialSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    courseID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    file: { type: String, required: true },
});
const Material = (0, mongoose_1.model)("Material", materialSchema);
exports.Material = Material;
//# sourceMappingURL=Material.js.map