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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const default_1 = require("../validation/default");
const course_1 = require("../validation/course");
const JWT_1 = require("../Lib/JWT");
const Student_1 = require("../models/Student");
const Misc_1 = require("../Lib/Misc");
const Log_1 = require("../models/Log");
const Methods_1 = require("../Lib/Methods");
const student_1 = require("../validation/student");
const Lecturer_1 = require("../models/Lecturer");
const Admin_1 = require("../models/Admin");
const basePath = "/student";
function default_2(app) {
    app.post(`${basePath}/login`, default_1.validateLoginRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id, password, navigatorObject } = req.body;
        const student = yield Student_1.Student.findOne({ serviceNumber: id.toUpperCase() });
        if (student) {
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, student.password);
            const log = yield new Log_1.Log({
                personnelID: student.id,
                id: (0, Methods_1.generateRandomString)(32),
                userType: "student",
                action: "login",
                navigatorObject: navigatorObject,
                comments: isPasswordCorrect ? "Login successful!" : "Invalid Password",
                timestamp: Date.now(),
            }).save();
            res.json({
                status: true,
                statusCode: isPasswordCorrect ? 200 : 401,
                message: "Incorrect password",
                student: isPasswordCorrect ? student : null,
                token: isPasswordCorrect
                    ? yield (0, JWT_1.createToken)(student.id, "student")
                    : null,
                log: log.action,
            });
        }
        else {
            res.json({
                status: true,
                message: "Student not found",
                statusCode: 401,
            });
        }
    }));
    app.post(`${basePath}/profile/get`, course_1.validateTokenSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "student") {
            const student = yield Student_1.Student.findOne({ id }).select("id firstName lastName email rank serviceNumber gender role");
            res.json({
                status: true,
                statusCode: 200,
                data: student,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/profile/update`, student_1.validateUpdateStudentProfileRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, firstName, lastName, email } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "student") {
            const student = yield Student_1.Student.findOneAndUpdate({ id }, { firstName, lastName, email });
            res.json({
                status: true,
                statusCode: 200,
                data: student,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/password/update`, student_1.validateUpdateStudentProfileRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, password, user: userCase } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            if (user === userCase) {
                const newPassword = yield (0, Methods_1.genPassword)(password);
                switch (userCase) {
                    case "student":
                        Student_1.Student.findOneAndUpdate({ id }, { password: newPassword });
                        break;
                    case "lecturer":
                        Lecturer_1.Lecturer.findOneAndUpdate({ id }, { password: newPassword });
                        break;
                    case "admin":
                        Admin_1.Admin.findOneAndUpdate({ id }, { password: newPassword });
                        break;
                }
                res.json({
                    status: true,
                    statusCode: 200,
                    data: {},
                    message: "Your password has been successfully updated!",
                });
            }
            else {
                res.json(Misc_1.UnauthorizedResponseObject);
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_2;
//# sourceMappingURL=student.js.map