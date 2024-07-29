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
const Examination_1 = require("../models/Examination");
const Misc_1 = require("../Lib/Misc");
const Methods_1 = require("../Lib/Methods");
const examination_1 = require("../validation/examination");
const Attendance_1 = require("../models/Attendance");
const Results_1 = require("../models/Results");
const Student_1 = require("../models/Student");
const Admin_1 = require("../models/Admin");
const Batch_1 = require("../models/Batch");
const basePath = "/examination";
function default_1(app) {
    app.post(`${basePath}/create`, examination_1.validateCreateExaminationSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, title, date, duration } = req.body;
        const { id } = (0, JWT_1.verifyToken)(token);
        const admin = yield Admin_1.Admin.findOne({ id });
        if (token && admin) {
            const examination = yield new Examination_1.Examination({
                id: (0, Methods_1.generateRandomString)(32),
                title,
                date,
                duration,
                approved: false,
                completed: false,
                published: false,
                started: false,
                password: "",
                students: [],
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
                    : yield Examination_1.Examination.find({ instructorID: id });
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
                : yield Examination_1.Examination.findOne({
                    id: examinationID,
                    instructorID: id,
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
    app.post(`${basePath}s/unsullied/all`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "student") {
            const examination = yield Batch_1.Batch.find({
                started: true,
                completed: false,
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
        const { token, batchID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "student") {
            const batch = yield Batch_1.Batch.findOne({
                id: batchID,
                started: true,
                completed: false,
            });
            const resultIfExists = yield Results_1.Result.findOne({
                batchID,
                examinationID: batch.examinationID,
                studentID: id,
            });
            if (resultIfExists && resultIfExists.id) {
                //Student result exists for examination so student is not eligible to write paper
                res.json({
                    status: true,
                    statusCode: 401,
                    message: "You have already written this paper",
                });
            }
            else {
                if (batch) {
                    const didStudentRegisterForExamination = batch === null || batch === void 0 ? void 0 : batch.students.includes(id);
                    // &&
                    // !attendance.students.includes(id);
                    res.json({
                        status: true,
                        statusCode: didStudentRegisterForExamination ? 200 : 401,
                        message: didStudentRegisterForExamination
                            ? "Examination found!"
                            : "You are not eligible to write this examination",
                        data: batch,
                    });
                }
                else {
                    res.json({
                        status: true,
                        statusCode: 404,
                        message: "Examination does not exist",
                    });
                }
            }
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
        const { token, examinationID, questions, title, date, course } = req.body;
        const { id } = (0, JWT_1.verifyToken)(token);
        const admin = yield Admin_1.Admin.findOne({ id });
        if (token && admin) {
            const examination = yield Examination_1.Examination.findOneAndUpdate({ id: examinationID }, { questions, title, date, course });
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
        const admin = yield Admin_1.Admin.findOne({ id });
        if (id && user === "admin" && admin) {
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
    app.post(`${basePath}/add-students`, examination_1.validateAddStudentsToExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, students } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        console.log(examinationID, students);
        if (!id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const examination = yield Examination_1.Examination.findOneAndUpdate({
                id: examinationID,
            }, { students });
            res.json((0, Misc_1.returnSuccessResponseObject)(examination === null ? "Not Found!" : "Examination published!", examination === null ? 404 : 200, examination));
        }
    }));
    app.post(`${basePath}/students/all`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, batchID, isAdmin } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && isAdmin && user !== "student") {
            const batch = yield Batch_1.Batch.findOne({ id: batchID });
            const students = batch.students;
            const studentFullRecords = yield Student_1.Student.find({
                id: { $in: students },
            });
            console.log(studentFullRecords, students);
            res.json({
                statusCode: 200,
                message: "Examination eligible students found!",
                data: studentFullRecords,
                status: true,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/change-password`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, batchID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const password = (0, Methods_1.generateRandomString)(6, "ALPHABET").toUpperCase();
            yield Batch_1.Batch.findOneAndUpdate({
                id: batchID,
            }, { started: true, password });
            res.json({
                statusCode: 200,
                status: true,
                message: "Examination password has been changed!",
                data: { password },
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/create-batch`, examination_1.validateCreateExaminationBatchRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, batch, students } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user === "admin") {
            const examination = yield Examination_1.Examination.findOne({ id: examinationID });
            const existingBatch = yield Batch_1.Batch.findOne({ batchNumber: batch });
            if (existingBatch && existingBatch.id) {
                res.json({
                    statusCode: 409,
                    status: true,
                    message: "Batch already exists!",
                });
            }
            else {
                const newBatch = yield new Batch_1.Batch({
                    id: (0, Methods_1.generateRandomString)(32),
                    examinationID,
                    title: `${examination.title}`,
                    batchNumber: batch,
                    duration: examination.duration,
                    date: examination.date,
                    approved: true,
                    published: true,
                    started: false,
                    completed: false,
                    questions: examination.questions,
                    students,
                    password: "",
                    blacklist: [],
                }).save();
                res.json({
                    statusCode: 201,
                    status: true,
                    message: "Examination batch has been created!",
                    data: newBatch,
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/batches/all`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (!id || !user) {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const batches = yield Batch_1.Batch.find({ examinationID });
            res.json({
                statusCode: 200,
                status: true,
                message: "Examination batches retrieved!",
                data: batches,
            });
        }
    }));
    app.post(`${basePath}/batch/get`, examination_1.validateGetSingleExaminationBatchRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, batchID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (!id || !user) {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const batches = yield Batch_1.Batch.findOne({ id: batchID });
            res.json({
                statusCode: 200,
                status: true,
                message: "Examination batch retrieved!",
                data: batches,
            });
        }
    }));
    app.post(`${basePath}/start`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, batchID, isAdmin } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (!isAdmin || !id || !user || user !== "admin") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const password = (0, Methods_1.generateRandomString)(6, "ALPHABET").toUpperCase();
            const batch = yield Batch_1.Batch.findOneAndUpdate({
                id: batchID,
            }, { started: true, password });
            yield new Attendance_1.Attendance({
                id: (0, Methods_1.generateRandomString)(32),
                batchID,
                examinationID: batch.examinationID,
                timestamp: Date.now(),
                students: [],
            }).save();
            res.json({
                statusCode: 200,
                status: true,
                message: "Examination Batch starting",
                data: { password },
            });
        }
    }));
    app.post(`${basePath}/end`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, batchID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const batch = yield Batch_1.Batch.findOneAndUpdate({
                id: batchID,
            }, { completed: true });
            res.json({
                statusCode: 200,
                status: true,
                message: "Examination completed",
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/redo`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const examination = yield Examination_1.Examination.findOneAndUpdate({
                id: examinationID,
            }, { completed: false, started: false });
            res.json({
                statusCode: 200,
                status: true,
                message: "Examination can be taken again",
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/validate-password`, examination_1.validateExaminationPasswordRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, batchID, password } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const batch = yield Batch_1.Batch.findOne({
                id: batchID,
            });
            if (batch.blacklist.includes(id)) {
                res.json({
                    status: true,
                    statusCode: 401,
                    messasge: "You are not permitted to write this paper. Please contact Admin!",
                });
            }
            else {
                if (password === batch.password) {
                    const attendance = yield Attendance_1.Attendance.findOne({ batchID });
                    if (!attendance.students.includes(id)) {
                        yield Attendance_1.Attendance.findOneAndUpdate({ batchID }, { $push: { students: id } });
                    }
                }
                res.json({
                    statusCode: password === batch.password ? 200 : 404,
                    status: true,
                    message: password === batch.password
                        ? "Correct password!"
                        : "Incorrect password",
                    data: { password },
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/blacklist/get`, examination_1.validateDefaultBatchRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { token, batchID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user !== "student") {
            const batch = yield Batch_1.Batch.findOne({ id: batchID });
            res.json({
                status: true,
                statusCode: 200,
                data: (_a = batch === null || batch === void 0 ? void 0 : batch.blacklist) !== null && _a !== void 0 ? _a : [],
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/blacklist/update`, examination_1.validateStudentBlacklistRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, batchID, studentID, action } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            if (action === "blacklist") {
                //Add Student to examination blacklist
                const batch = yield Batch_1.Batch.findOneAndUpdate({ id: batchID }, { $push: { blacklist: studentID } });
                res.json({
                    status: true,
                    statusCode: 200,
                    message: `Student has been blacklisted from ${batch.title}`,
                });
            }
            else {
                const batch = yield Batch_1.Batch.findOne({ id: batchID });
                const newBlacklist = batch.blacklist.filter((s) => s !== studentID);
                yield Batch_1.Batch.findOneAndUpdate({ id: batchID }, { blacklist: newBlacklist });
                res.json({
                    status: true,
                    statusCode: 200,
                    message: `Student has been whitelisted into ${batch.title}`,
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/submit-paper`, examination_1.validateStudentSubmissionRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, batchID, questions } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "student") {
            const batch = yield Batch_1.Batch.findOne({ id: batchID });
            const student = yield Student_1.Student.findOne({ id });
            const attendance = yield Attendance_1.Attendance.findOne({
                batchID: batchID,
            });
            const isStudentInBlacklist = batch.blacklist.includes(id);
            const students = attendance.students;
            if (students.includes(id) && !isStudentInBlacklist) {
                const examinationQuestions = batch.questions;
                const marksObtainable = examinationQuestions.length;
                const count = questions.map((q) => {
                    const foundQuestion = examinationQuestions.find((eQuestion) => eQuestion.id === q.id);
                    return foundQuestion.answer === q.answer;
                });
                const correctCount = count.filter((val) => val === true);
                const percent = (correctCount.length / marksObtainable) * 100;
                const result = {
                    grading: {
                        marksObtainable,
                        numberCorrect: correctCount.length,
                        percent,
                    },
                    exam: {
                        title: batch.title,
                        date: Date.now(),
                        questions: batch.questions,
                        studentQuestions: questions,
                    },
                    attendance: {
                        date: attendance.timestamp,
                    },
                };
                const fullResultDetails = yield new Results_1.Result(Object.assign({ id: (0, Methods_1.generateRandomString)(32), examinationID: batch.examinationID, batchNumber: batch.batchNumber, batchID, studentID: id, name: student.name, rank: student.rank, unit: student.unit, serviceNumber: student.serviceNumber }, result)).save();
                res.json({
                    statusCode: 200,
                    status: true,
                    message: "Examination successfully graded!",
                    data: fullResultDetails,
                });
            }
            else {
                res.json({
                    statusCode: 401,
                    status: true,
                    message: "You are not eligible to write this examination. Please contact Admin",
                });
            }
            // const
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/batches/get-completed`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, page, limit } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const batches = yield Batch_1.Batch.find({ completed: true }, {}, {
                skip: page === 1 ? 0 : page === 2 ? limit : (page - 1) * limit,
                limit,
            });
            const attendances = yield Attendance_1.Attendance.find();
            const results = yield Results_1.Result.find();
            res.json({
                statusCode: 200,
                status: true,
                message: "Examinations found!",
                data: { batches, attendances, results },
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=examination.js.map