"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const mongoose_1 = require("mongoose");
const logSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    personnelID: { type: String, required: true },
    userType: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Number, required: true },
    navigatorObject: { type: Object, required: true },
    comments: { type: String, required: false },
});
const Log = (0, mongoose_1.model)("Log", logSchema);
exports.Log = Log;
//# sourceMappingURL=Log.js.map