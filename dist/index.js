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
const admin_1 = __importDefault(require("./src/routes/admin"));
const student_1 = __importDefault(require("./src/routes/student"));
const lecturer_1 = __importDefault(require("./src/routes/lecturer"));
const examination_1 = __importDefault(require("./src/routes/examination"));
const course_1 = __importDefault(require("./src/routes/course"));
const file_1 = __importDefault(require("./src/routes/file"));
const Methods_1 = require("./src/Lib/Methods");
const misc_1 = __importDefault(require("./src/routes/misc"));
const school_1 = __importDefault(require("./src/routes/school"));
const result_1 = __importDefault(require("./src/routes/result"));
const log_1 = __importDefault(require("./src/routes/log"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use((0, body_parser_1.default)({ extended: true }));
const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";
// const dbConnectString =
//   "mongodb+srv://theajstars:XS4582oDGlvmhAub@data.hy4gux2.mongodb.net/?retryWrites=true&w=majority&appName=data/nafiamDB";
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
    (0, school_1.default)(app);
    (0, result_1.default)(app);
    (0, log_1.default)(app);
    // new Admin({
    //   id: generateRandomString(32),
    //   firstName: "Zeus",
    //   lastName: "Olympus",
    //   email: "me@theajstars.com",
    //   password: hash,
    // }).save();
    (0, Methods_1.genPassword)("AJIBOYE");
    // Course.updateMany({}, { lecturerID: "1709114865502" }).exec();
})
    .catch((err) => {
    console.error("Failed to connect to DB", err);
});
//# sourceMappingURL=index.js.map