"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const login_1 = __importDefault(require("./src/routes/login"));
const app = (0, express_1.default)();
exports.app = app;
const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";
(0, mongoose_1.connect)(dbConnectString)
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    (0, login_1.default)(app);
})
    .catch((err) => {
    console.error("Failed to connect to DB", err);
});
//# sourceMappingURL=index.js.map