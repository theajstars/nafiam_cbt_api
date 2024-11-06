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
                published: false,
                started: false,
                completed: false,
                password: "",
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
            const examination = yield Batch_1.Batch.findOne({
                id: batchID,
                started: true,
                completed: false,
            });
            const resultIfExists = yield Results_1.Result.findOne({
                batchID,
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
                if (examination) {
                    const didStudentRegisterForExamination = examination.students.includes(id);
                    // &&
                    // !attendance.students.includes(id);
                    res.json({
                        status: true,
                        statusCode: didStudentRegisterForExamination ? 200 : 401,
                        message: didStudentRegisterForExamination
                            ? "Examination found!"
                            : "You are not eligible to write this examination",
                        data: examination,
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
        const { token, examinationID, questions, title, date, duration } = req.body;
        const { id } = (0, JWT_1.verifyToken)(token);
        const admin = yield Admin_1.Admin.findOne({ id });
        if (token && admin) {
            const examination = yield Examination_1.Examination.findOneAndUpdate({ id: examinationID }, { questions, title, date, duration });
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
    app.post(`${basePath}/students/all`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, isAdmin } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && isAdmin && user !== "student") {
            const examination = yield Examination_1.Examination.findOne({ id: examinationID });
            const students = examination.students;
            res.json({
                statusCode: 200,
                message: "Examination eligible students found!",
                data: students,
                status: true,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/students/unbatched`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, page, limit } = req.body;
        console.log({ token, examinationID, page, limit });
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user !== "student") {
            const batches = yield Batch_1.Batch.find({ examinationID });
            let batchedStudents = [];
            batches.map((b) => {
                batchedStudents = [...batchedStudents, ...b.students];
            });
            console.log(batchedStudents);
            const students = yield Student_1.Student.find({ id: { $nin: batchedStudents } }, {}, {
                skip: page === 1 ? 0 : page === 2 ? limit : (page - 1) * limit,
                limit,
            }).select("-password");
            const totalCount = yield Student_1.Student.countDocuments({
                id: { $nin: batchedStudents },
            });
            res.json({
                status: true,
                statusCode: 200,
                data: students,
                page,
                limit,
                rows: students.length,
                total: totalCount,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/batch/students/:batchID`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user !== "student") {
            const { batchID } = req.params;
            const batch = yield Batch_1.Batch.findOne({ id: batchID });
            const students = yield Student_1.Student.find({ id: { $in: batch === null || batch === void 0 ? void 0 : batch.students } });
            res.json({
                statusCode: 200,
                message: "Examination eligible students found!",
                data: students,
                status: true,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/change-password`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const password = (0, Methods_1.generateRandomString)(6, "ALPHABET").toUpperCase();
            yield Examination_1.Examination.findOneAndUpdate({
                id: examinationID,
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
    app.post(`${basePath}/start`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, batchID, isAdmin } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (!id || !user || user === "student") {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
        else {
            const password = (0, Methods_1.generateRandomString)(6, "ALPHABET").toUpperCase();
            const batch = yield Batch_1.Batch.findOne({ id: batchID });
            if (batch && batch.id) {
                yield new Attendance_1.Attendance({
                    id: (0, Methods_1.generateRandomString)(32),
                    examinationID: batch.examinationID,
                    batchID: batch.id,
                    timestamp: Date.now(),
                    students: [],
                }).save();
                yield Batch_1.Batch.updateOne({ id: batchID }, { started: true, password });
                res.json({
                    statusCode: 200,
                    status: true,
                    message: "Examination starting",
                    data: { password },
                });
            }
            else {
                res.json({
                    statusCode: 404,
                    status: true,
                    message: "Examination batch does not exist!",
                });
            }
        }
    }));
    app.post(`${basePath}/end`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const examination = yield Examination_1.Examination.findOneAndUpdate({
                id: examinationID,
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
            const examination = yield Batch_1.Batch.findOne({
                id: batchID,
            });
            if (examination.blacklist.includes(id)) {
                res.json({
                    status: true,
                    statusCode: 401,
                    messasge: "You are not permitted to write this paper. Please contact Admin!",
                });
            }
            else {
                if (password === examination.password) {
                    const attendance = yield Attendance_1.Attendance.findOne({ batchID });
                    if (!attendance.students.includes(id)) {
                        yield Attendance_1.Attendance.findOneAndUpdate({ batchID }, { $push: { students: id } });
                    }
                }
                res.json({
                    statusCode: password === examination.password ? 200 : 404,
                    status: true,
                    message: password === examination.password
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
    app.post(`${basePath}/blacklist/get`, examination_1.validateDefaultExaminationRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user !== "student") {
            const examination = yield Examination_1.Examination.findOne({ id: examinationID });
            res.json({
                status: true,
                statusCode: 200,
                data: (_a = examination === null || examination === void 0 ? void 0 : examination.blacklist) !== null && _a !== void 0 ? _a : [],
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/blacklist/update`, examination_1.validateStudentBlacklistRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, studentID, action } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            if (action === "blacklist") {
                //Add Student to examination blacklist
                const examination = yield Examination_1.Examination.findOneAndUpdate({ id: examinationID }, { $push: { blacklist: studentID } });
                res.json({
                    status: true,
                    statusCode: 200,
                    message: `Student has been blacklisted from ${examination.title}`,
                });
            }
            else {
                const examination = yield Examination_1.Examination.findOne({ id: examinationID });
                const newBlacklist = examination.blacklist.filter((s) => s !== studentID);
                yield Examination_1.Examination.findOneAndUpdate({ id: examinationID }, { blacklist: newBlacklist });
                res.json({
                    status: true,
                    statusCode: 200,
                    message: `Student has been whitelisted into ${examination.title}`,
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
            const examination = yield Batch_1.Batch.findOne({ id: batchID });
            const student = yield Student_1.Student.findOne({ id });
            const attendance = yield Attendance_1.Attendance.findOne({
                batchID: batchID,
            });
            const isStudentInBlacklist = examination.blacklist.includes(id);
            const students = attendance.students;
            if (students.includes(id) && !isStudentInBlacklist) {
                const marksObtainable = examination.questions.length;
                const count = questions.map((q) => {
                    const foundQuestion = examination.questions.find((eQuestion) => eQuestion.id === q.id);
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
                        title: examination.title,
                        date: examination.date,
                        questions: examination.questions,
                        studentQuestions: questions,
                    },
                    attendance: {
                        date: attendance.timestamp,
                    },
                };
                yield new Results_1.Result(Object.assign({ id: (0, Methods_1.generateRandomString)(32), examinationID: examination.examinationID, batchID: batchID, studentID: id, name: student.name, serviceNumber: student.serviceNumber }, result)).save();
                res.json({
                    statusCode: 200,
                    status: true,
                    message: "Examination successfully graded!",
                    data: result,
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
    app.post(`${basePath}/batch/get`, examination_1.validateGetSingleBatchRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
}
exports.default = default_1;
//# sourceMappingURL=examination.js.map