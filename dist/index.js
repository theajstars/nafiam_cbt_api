"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_1 = __importDefault(require("./src/routes/admin"));
const student_1 = __importDefault(require("./src/routes/student"));
const lecturer_1 = __importDefault(require("./src/routes/lecturer"));
const examination_1 = __importDefault(require("./src/routes/examination"));
const course_1 = __importDefault(require("./src/routes/course"));
const file_1 = __importDefault(require("./src/routes/file"));
const misc_1 = __importDefault(require("./src/routes/misc"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use((0, body_parser_1.default)({ extended: true }));
const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";
(0, mongoose_1.connect)(dbConnectString)
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    (0, student_1.default)(app);
    (0, misc_1.default)(app);
    (0, admin_1.default)(app);
    (0, lecturer_1.default)(app);
    (0, examination_1.default)(app);
    (0, course_1.default)(app);
    (0, file_1.default)(app);
    const genPassword = () => __awaiter(void 0, void 0, void 0, function* () {
        // new Admin({
        //   id: generateRandomString(32),
        //   firstName: "Zeus",
        //   lastName: "Olympus",
        //   email: "me@theajstars.com",
        //   password: hash,
        // }).save();
        const saltRounds = 10;
        const salt = yield bcryptjs_1.default.genSalt(saltRounds);
        const hash = yield bcryptjs_1.default.hash("securePassword2024", salt);
        console.log("Thine Hash", hash);
    });
    genPassword();
    // Course.updateMany({}, { lecturerID: "1709114865502" }).exec();
})
    .catch((err) => {
    console.error("Failed to connect to DB", err);
});
//# sourceMappingURL=index.js.map