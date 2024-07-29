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
const course_1 = require("../validation/course");
const Results_1 = require("../models/Results");
const student_1 = require("../validation/student");
const Attendance_1 = require("../models/Attendance");
const basePath = "/result";
function default_1(app) {
    // Get One student Result for One Examination
    app.post(`${basePath}/student/get`, student_1.validateGetSingleResultRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, batchID, studentID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const result = yield Results_1.Result.findOne({
                batchID,
                studentID: studentID !== null && studentID !== void 0 ? studentID : id,
            });
            res.json({
                status: true,
                statusCode: 200,
                message: "Result found!",
                data: result,
            });
        }
    }));
    // Get All Student Results for One examination
    app.post(`${basePath}s/students/get`, student_1.validateGetSingleResultRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const results = yield Results_1.Result.find({
                examinationID,
            });
            res.json({
                status: true,
                statusCode: 200,
                message: "Results found!",
                data: results,
            });
        }
    }));
    // Get One Student Result for ALL examination
    app.post(`${basePath}s/student/all`, student_1.validateGetOneStudentAllResultRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, studentID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const results = yield Results_1.Result.find({
                studentID: user === "student" ? id : studentID,
            });
            res.json({
                status: true,
                statusCode: 200,
                message: "Results found!",
                data: results,
            });
        }
    }));
    // Get All Results all at once
    app.post(`${basePath}s/all`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user !== "student") {
            const results = yield Results_1.Result.find();
            res.json({
                status: true,
                statusCode: 200,
                message: "Results found!",
                data: results,
            });
        }
    }));
    // Get All Examination Attendances
    app.post(`${basePath}s/attendances/all`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user !== "student") {
            const attendances = yield Attendance_1.Attendance.find();
            res.json({
                status: true,
                statusCode: 200,
                message: "Attendances found!",
                data: attendances,
            });
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=result.js.map