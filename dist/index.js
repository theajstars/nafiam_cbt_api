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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const admin_1 = __importDefault(require("./src/routes/admin"));
const student_1 = __importDefault(require("./src/routes/student"));
const instructor_1 = __importDefault(require("./src/routes/instructor"));
const examination_1 = __importDefault(require("./src/routes/examination"));
const course_1 = __importDefault(require("./src/routes/course"));
const file_1 = __importDefault(require("./src/routes/file"));
const Examination_1 = require("./src/models/Examination");
const Admin_1 = require("./src/models/Admin");
const Methods_1 = require("./src/Lib/Methods");
const misc_1 = __importDefault(require("./src/routes/misc"));
const school_1 = __importDefault(require("./src/routes/school"));
const result_1 = __importDefault(require("./src/routes/result"));
const log_1 = __importDefault(require("./src/routes/log"));
const lecture_1 = __importDefault(require("./src/routes/lecture"));
const practice_1 = __importDefault(require("./src/routes/practice"));
const Data_1 = require("./src/Lib/Data");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use((0, body_parser_1.default)({ extended: true }));
// app.use(logger);
const PORT = process.env.PORT;
// const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";
const dbConnectString = process.env.MONGO_URL;
(0, mongoose_1.connect)(dbConnectString)
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    (0, student_1.default)(app);
    (0, misc_1.default)(app);
    (0, admin_1.default)(app);
    (0, instructor_1.default)(app);
    (0, examination_1.default)(app);
    (0, course_1.default)(app);
    (0, file_1.default)(app);
    (0, school_1.default)(app);
    (0, result_1.default)(app);
    (0, log_1.default)(app);
    (0, lecture_1.default)(app);
    (0, practice_1.default)(app);
    // async function blue() {
    //   await Student.updateMany(
    //     {},
    //     { password: await genPassword("NAFIAM2024") }
    //   );
    //   console.log("Done!");
    // }
    // blue();
    function createAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield (0, Methods_1.genPassword)(`NAFIAM${Data_1.year}`);
            const admin = yield new Admin_1.Admin({
                id: (0, Methods_1.generateRandomString)(32),
                name: "Zeus of Olympus",
                serviceNumber: "NAF01/12345",
                rank: "Air Chief Marshal",
                dateCreated: Date.now(),
                password: hash,
                isChangedPassword: true,
                superUser: true,
            }).save();
        });
    }
    function changeAdminPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield (0, Methods_1.genPassword)("NAFIAM2024");
            yield Admin_1.Admin.updateMany({}, { password: hash });
            console.log("Password has been changed!");
        });
    }
    function DoSomething() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Examination_1.Examination.updateMany({}, { published: false });
        });
    }
    // DoSomething();
    // changeAdminPassword();
    // createAdmin();
    // Course.updateMany({}, { instructorID: "1709114865502" }).exec();
})
    .catch((err) => {
    console.error("Failed to connect to DB", err);
    app.listen(PORT, () => console.log(`Server running without DB on port: ${PORT}`));
});
//# sourceMappingURL=index.js.map