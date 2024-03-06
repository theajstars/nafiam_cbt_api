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
const Admin_1 = require("../models/Admin");
const JWT_1 = require("../Lib/JWT");
const Misc_1 = require("../Lib/Misc");
const Student_1 = require("../models/Student");
const Methods_1 = require("../Lib/Methods");
const admin_1 = require("../validation/admin");
const course_1 = require("../validation/course");
const default_1 = require("../validation/default");
const Log_1 = require("../models/Log");
const admin_2 = require("../validation/admin");
const Lecturer_1 = require("../models/Lecturer");
const basePath = "/admin";
function default_2(app) {
    app.post(`${basePath}/login`, default_1.validateLoginRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id, password, navigatorObject } = req.body;
        const admin = yield Admin_1.Admin.findOne({ email: id });
        if (admin) {
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, admin.password);
            const log = yield new Log_1.Log({
                personnelID: admin.id,
                id: (0, Methods_1.generateRandomString)(32),
                userType: "admin",
                action: "login",
                navigatorObject: navigatorObject,
                comments: isPasswordCorrect ? "Login successful!" : "Invalid Password",
                timestamp: Date.now(),
            }).save();
            res.json({
                status: true,
                statusCode: isPasswordCorrect ? 200 : 401,
                admin: isPasswordCorrect ? admin : null,
                token: isPasswordCorrect ? yield (0, JWT_1.createToken)(admin.id, "admin") : null,
            });
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
            });
        }
    }));
    app.post(`${basePath}/profile/get`, course_1.validateTokenSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const admin = yield Admin_1.Admin.findOne({ id }).select("firstName lastName email");
            res.json({
                status: true,
                statusCode: 200,
                data: admin,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/verify_token`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { user, id } = (0, JWT_1.verifyToken)(token);
        if (!id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const admin = yield Admin_1.Admin.findOne({ id });
            if (admin !== null && admin.id) {
                res.json({
                    status: true,
                    statusCode: 200,
                    data: admin,
                    message: "Verified successfully!",
                });
            }
            else {
                res.json(Misc_1.UnauthorizedResponseObject);
            }
        }
    }));
    app.post("/admin/student/onboard", admin_1.validateOnboardStudent, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, email, firstName, lastName, rank, gender, role, serviceNumber, } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const studentExists = yield Student_1.Student.findOne({
                $or: [{ email: email }, { serviceNumber }],
            });
            if (!studentExists) {
                const saltRounds = 10;
                const salt = yield bcryptjs_1.default.genSalt(saltRounds);
                const hash = yield bcryptjs_1.default.hash(lastName.toUpperCase(), salt);
                const student = yield new Student_1.Student({
                    id: (0, Methods_1.generateRandomString)(32),
                    email,
                    firstName,
                    lastName,
                    rank,
                    role,
                    serviceNumber,
                    gender,
                    password: hash,
                    // school,
                }).save();
                res.json({
                    status: true,
                    statusCode: 201,
                    data: student,
                    message: "New Student created",
                });
            }
            else {
                res.json({
                    status: true,
                    statusCode: 409,
                    data: false,
                    message: "Student exists!",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/student/update`, admin_1.validateUpdateStudent, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { studentID, token, email, firstName, lastName, rank, gender, role, serviceNumber, } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const studentExists = yield Student_1.Student.findOne({
                $or: [{ email: email }, { serviceNumber }],
            });
            if (studentExists && studentExists.id !== studentID) {
                res.json({
                    status: true,
                    statusCode: 409,
                    data: { id: studentExists.id, studentID },
                    message: "Student exists!",
                });
            }
            else {
                const student = yield Student_1.Student.findOneAndUpdate({ id: studentID }, {
                    id: (0, Methods_1.generateRandomString)(32),
                    email,
                    firstName,
                    lastName,
                    rank,
                    role,
                    serviceNumber,
                    gender,
                    // school,
                });
                res.json({
                    status: true,
                    statusCode: 200,
                    data: student,
                    message: "Student updated",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post("/admin/students/get", course_1.validateTokenSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { user, id } = (0, JWT_1.verifyToken)(token);
        if (!id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const students = yield Student_1.Student.find({});
            res.json({
                data: students,
                status: true,
                statusCode: 200,
                message: "Students found!",
            });
        }
    }));
    app.post("/admin/getStudent/:studentID", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const studentID = req.params.studentID;
        const v = (0, JWT_1.verifyToken)(body.token);
        if (!body || !body.token || v.user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const student = yield Student_1.Student.findOne({ id: studentID });
            res.json({
                data: student,
                status: true,
                statusCode: student ? 200 : 404,
            });
        }
    }));
    app.delete("/admin/student/:studentID", course_1.validateTokenSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { studentID } = req.params;
        const { user, id } = (0, JWT_1.verifyToken)(token);
        if (!id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const student = yield Student_1.Student.findOneAndDelete({ id: studentID });
            res.json({
                data: student,
                status: true,
                statusCode: 204,
                message: "Student deleted!",
            });
        }
    }));
    //LECTURERS FUNCTIONALITY
    app.post(`${basePath}/lecturer/create`, admin_2.validateCreateLecturer, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, email, firstName, lastName, rank, gender, role, serviceNumber, } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const lecturerExists = yield Lecturer_1.Lecturer.findOne({
                $or: [{ email: email }, { serviceNumber }],
            });
            if (!lecturerExists) {
                const saltRounds = 10;
                const salt = yield bcryptjs_1.default.genSalt(saltRounds);
                const hash = yield bcryptjs_1.default.hash(lastName.toUpperCase(), salt);
                const lecturer = yield new Lecturer_1.Lecturer({
                    id: (0, Methods_1.generateRandomString)(32),
                    email,
                    firstName,
                    lastName,
                    rank,
                    role,
                    serviceNumber,
                    gender,
                    password: hash,
                    // school,
                }).save();
                res.json({
                    status: true,
                    statusCode: 201,
                    data: lecturer,
                    message: "New Lecturer created",
                });
            }
            else {
                res.json({
                    status: true,
                    statusCode: 409,
                    data: false,
                    message: "Lecturer exists!",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/lecturer/update`, admin_2.validateUpdateLecturer, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { lecturerID, token, email, firstName, lastName, rank, gender, role, serviceNumber, } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const lecturerExists = yield Lecturer_1.Lecturer.findOne({
                $or: [{ email: email }, { serviceNumber }],
            });
            if (lecturerExists && lecturerExists.id !== lecturerID) {
                res.json({
                    status: true,
                    statusCode: 409,
                    data: { id: lecturerExists.id, lecturerID },
                    message: "Lecturer exists!",
                });
            }
            else {
                const lecturer = yield Lecturer_1.Lecturer.findOneAndUpdate({ id: lecturerID }, {
                    id: (0, Methods_1.generateRandomString)(32),
                    email,
                    firstName,
                    lastName,
                    rank,
                    role,
                    serviceNumber,
                    gender,
                    // school,
                });
                res.json({
                    status: true,
                    statusCode: 200,
                    data: lecturer,
                    message: "Lecturer updated",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/lecturer/get`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id } = (0, JWT_1.verifyToken)(token);
        const lecturer = yield Lecturer_1.Lecturer.findOne({ id }).select("email firstName lastName id rank gender serviceNumber role");
        if (lecturer) {
            res.json({
                status: true,
                statusCode: 200,
                data: lecturer,
                message: "Profile successfully retrieved!",
            });
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Not Found",
            });
        }
    }));
    app.post(`${basePath}/lecturers/all/get`, course_1.validateTokenSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const lecturers = yield Lecturer_1.Lecturer.find({}).select("email firstName lastName id rank gender role serviceNumber");
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
}
exports.default = default_2;
//# sourceMappingURL=admin.js.map