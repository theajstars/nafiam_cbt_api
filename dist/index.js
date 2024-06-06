"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const routes_1 = __importDefault(require("./src/routes/routes"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use((0, body_parser_1.default)({ extended: true }));
const PORT = 8080;
const dbConnectString = "mongodb+srv://theajstars:dGF9caF4b8PlrLtP@data.hy4gux2.mongodb.net/?retryWrites=true&w=majority&appName=data/nafiamDB";
(0, mongoose_1.connect)(dbConnectString)
    .then(() => {
    (0, routes_1.default)(app);
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
})
    .catch((err) => {
    console.error("Failed to connect to DB", err);
    app.listen(PORT, () => console.log(`Server running without DB on port: ${PORT}`));
});
//# sourceMappingURL=index.js.map