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
Object.defineProperty(exports, "__esModule", { value: true });
const JWT_1 = require("../Lib/JWT");
const Lecturer_1 = require("../models/Lecturer");
const Examination_1 = require("../models/Examination");
const Misc_1 = require("../Lib/Misc");
const Methods_1 = require("../Lib/Methods");
const examination_1 = require("../validation/examination");
const Course_1 = require("../models/Course");
const basePath = "/examination";
function default_1(app) {
    app.post(`${basePath}/create`, examination_1.validateCreateExaminationSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, title, year, course: courseCode } = req.body;
        const { id } = (0, JWT_1.verifyToken)(token);
        const lecturer = yield Lecturer_1.Lecturer.findOne({ id });
        if (token && lecturer) {
            const course = yield Course_1.Course.findOne({ code: courseCode });
            const examination = yield new Examination_1.Examination({
                id: (0, Methods_1.generateRandomString)(16),
                title,
                year,
                lecturerID: id,
                course: course.id,
                approved: false,
                completed: false,
                published: false,
                started: false,
                password: "",
                students: course.students,
            }).save();
            res.json((0, Misc_1.returnSuccessResponseObject)("Examination created!", 201, examination));
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Unauthorized",
            });
        }
    }));
    app.post(`${basePath}s/all`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, isAdmin } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (token && id) {
            if (isAdmin && user !== "admin") {
                res.json(Misc_1.UnauthorizedResponseObject);
            }
            else {
                const examinations = isAdmin && user === "admin"
                    ? yield Examination_1.Examination.find({})
                    : yield Examination_1.Examination.find({ lecturerID: id });
                res.json((0, Misc_1.returnSuccessResponseObject)("Examination list obtained!", 200, examinations));
            }
        }
    }));
    app.post(`${basePath}/get`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const examination = user === "admin"
                ? yield Examination_1.Examination.findOne({ id: examinationID })
                : yield Examination_1.Examination.findOne({ id: examinationID, lecturerID: id });
            console.log(examination, user, id);
            res.json((0, Misc_1.returnSuccessResponseObject)(examination === null ? "Not Found!" : "Examination found!", examination === null ? 404 : 200, examination));
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Unauthorized",
            });
        }
    }));
    app.post(`${basePath}s/unsullied/all`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "student") {
            const examination = yield Examination_1.Examination.find({
                started: true,
                students: { $in: [id] },
            });
            res.json((0, Misc_1.returnSuccessResponseObject)(examination === null ? "Not Found!" : "Examination found!", examination === null ? 404 : 200, examination));
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Unauthorized",
            });
        }
    }));
    app.post(`${basePath}/unsullied/get`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "student") {
            const examination = yield Examination_1.Examination.findOne({ id: examinationID });
            res.json((0, Misc_1.returnSuccessResponseObject)(examination === null ? "Not Found!" : "Examination found!", examination === null ? 404 : 200, examination));
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Unauthorized",
            });
        }
    }));
    app.delete(`${basePath}/delete`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user !== "student") {
            const examination = yield Examination_1.Examination.findOneAndDelete({
                id: examinationID,
            });
            res.json((0, Misc_1.returnSuccessResponseObject)(examination === null
                ? "Not Found!"
                : "Examination deleted successfully!", examination === null ? 404 : 200, examination));
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Unauthorized",
            });
        }
    }));
    app.post(`${basePath}/edit`, examination_1.validateEditExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, questions, title, year, course } = req.body;
        const { id } = (0, JWT_1.verifyToken)(token);
        const lecturer = yield Lecturer_1.Lecturer.findOne({ id });
        if (token && lecturer) {
            const examination = yield Examination_1.Examination.findOneAndUpdate({ id: examinationID }, { questions, title, year, course });
            res.json((0, Misc_1.returnSuccessResponseObject)(examination === null ? "Not Found!" : "Examination updated!", examination === null ? 404 : 201, examination));
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Unauthorized",
            });
        }
    }));
    app.post(`${basePath}/publish`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        const lecturer = yield Lecturer_1.Lecturer.findOne({ id });
        if (id && user === "lecturer" && lecturer) {
            const examination = yield Examination_1.Examination.findOneAndUpdate({ id: examinationID }, { published: true });
            res.json((0, Misc_1.returnSuccessResponseObject)(examination === null ? "Not Found!" : "Examination published!", examination === null ? 404 : 200, examination));
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Unauthorized",
            });
        }
    }));
    app.post(`${basePath}/approve`, examination_1.validateApproveExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, isAdmin, questions } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (!isAdmin || !id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const examination = yield Examination_1.Examination.findOneAndUpdate({
                id: examinationID,
            }, { approved: true, selectedQuestions: questions });
            res.json((0, Misc_1.returnSuccessResponseObject)(examination === null ? "Not Found!" : "Examination published!", examination === null ? 404 : 200, examination));
        }
    }));
    app.post(`${basePath}/start`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, isAdmin } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (!isAdmin || !id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const password = (0, Methods_1.generateRandomString)(6, "ALPHABET").toUpperCase();
            const examination = yield Examination_1.Examination.findOneAndUpdate({
                id: examinationID,
            }, { started: true, password });
            res.json({
                statusCode: 200,
                status: true,
                message: "Examination starting",
                data: { password },
            });
        }
    }));
    app.post(`${basePath}/validate-password`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, password } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const examination = yield Examination_1.Examination.findOne({
                id: examinationID,
            });
            res.json({
                statusCode: password === examination.password ? 200 : 404,
                status: true,
                message: password === examination.password
                    ? "Correct password!"
                    : "Incorrect password",
                data: { password },
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/timer/start`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, isAdmin } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (!isAdmin || !id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const examination = yield Examination_1.Examination.findOneAndUpdate({
                id: examinationID,
            }, { password: "" });
            res.json((0, Misc_1.returnSuccessResponseObject)(examination === null ? "Not Found!" : "Examination timer started!", examination === null ? 404 : 200, examination));
        }
    }));
    app.post(`${basePath}/students/get`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, isAdmin } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (!isAdmin || !id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const examination = yield Examination_1.Examination.findOne({
                id: examinationID,
            });
            const course = yield Course_1.Course.findOne({ id: examination.course });
            const { students } = course;
            res.json({
                statusCode: 200,
                status: true,
                message: "Students found!",
                data: students,
            });
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=examination.js.map