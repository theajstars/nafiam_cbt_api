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
const JWT_1 = require("../Lib/JWT");
const Lecturer_1 = require("../models/Lecturer");
const course_1 = require("../validation/course");
const Misc_1 = require("../Lib/Misc");
const Student_1 = require("../models/Student");
const lecturer_1 = require("../validation/lecturer");
const default_1 = require("../validation/default");
const Methods_1 = require("../Lib/Methods");
const Log_1 = require("../models/Log");
const basePath = "/lecturer";
function default_2(app) {
    app.post(`${basePath}/login`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id, password } = req.body;
        const lecturer = yield Lecturer_1.Lecturer.findOne({
            $or: [{ serviceNumber: id.toUpperCase() }, { email: id }],
        });
        if (lecturer) {
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, lecturer.password);
            const log = yield new Log_1.Log({
                personnelID: lecturer.id,
                id: (0, Methods_1.generateRandomString)(32),
                userType: "lecturer",
                action: "login",
                comments: isPasswordCorrect ? "Login successful!" : "Invalid Password",
                timestamp: Date.now(),
                status: isPasswordCorrect ? "success" : "error",
            }).save();
            res.json({
                status: true,
                statusCode: isPasswordCorrect ? 200 : 401,
                message: isPasswordCorrect ? "Logged In!" : "Incorrect Password",
                token: isPasswordCorrect
                    ? yield (0, JWT_1.createToken)(lecturer.id, "lecturer")
                    : null,
                log,
            });
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Account not found",
            });
        }
    }));
    app.post(`${basePath}/profile/get`, lecturer_1.validateDefaultLecturerRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, lecturerID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const lecturer = yield Lecturer_1.Lecturer.findOne({ id: lecturerID !== null && lecturerID !== void 0 ? lecturerID : id });
            res.json({
                status: true,
                statusCode: 200,
                message: "Lecturer found!",
                data: lecturer,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/profile/update`, default_1.validateDefaultProfileUpdateRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, firstName, lastName, email } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const lecturer = yield Lecturer_1.Lecturer.findOneAndUpdate({ id }, { firstName, lastName, email });
            res.json({
                status: true,
                statusCode: 200,
                data: lecturer,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}s/all`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user !== "student") {
            const lecturers = yield Lecturer_1.Lecturer.find({}).select("email firstName lastName id rank gender role serviceNumber  dateCreated isChangedPassword school");
            res.json({
                status: true,
                statusCode: 200,
                data: lecturers,
                message: "Lecturers retrieved!",
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/students/all`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { user, id } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const students = yield Student_1.Student.find({}).select("id firstName lastName email password serviceNumber rank gender role school");
            res.json({
                data: students,
                status: true,
                statusCode: 200,
                message: "Students found!",
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_2;
//# sourceMappingURL=lecturer.js.map