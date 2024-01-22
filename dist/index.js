"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = require("mongoose");
const student_1 = __importDefault(require("./src/routes/student"));
const admin_1 = __importDefault(require("./src/routes/admin"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, body_parser_1.default)({ extended: true }));
const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";
(0, mongoose_1.connect)(dbConnectString)
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    (0, student_1.default)(app);
    (0, admin_1.default)(app);
})
    .catch((err) => {
    console.error("Failed to connect to DB", err);
});
//# sourceMappingURL=index.js.map