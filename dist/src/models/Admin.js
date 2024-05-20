"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    serviceNumber: { type: String, required: true },
    rank: { type: String, required: true },
    dateCreated: { type: Number, required: true },
    password: { type: String, required: true },
    school: { type: String, required: false },
    isChangedPassword: { type: Boolean, required: true },
    superUser: { type: Boolean, required: true },
});
const Admin = (0, mongoose_1.model)("Admin", adminSchema);
exports.Admin = Admin;
//# sourceMappingURL=Admin.js.map