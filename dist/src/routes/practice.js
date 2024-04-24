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
const Misc_1 = require("../Lib/Misc");
const lecture_1 = require("../validation/lecture");
const Lecture_1 = require("../models/Lecture");
const Methods_1 = require("../Lib/Methods");
const Practice_1 = require("../models/Practice");
const practice_1 = require("../validation/practice");
const Attempt_1 = require("../models/Attempt");
const examination_1 = require("../validation/examination");
const Whitelist_1 = require("../models/Whitelist");
const basePath = "/practice";
function default_1(app) {
    // Update the questions of the lecture
    app.post(`${basePath}/update`, lecture_1.validateUpdatePracticeQuestionsRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, lectureID, questions } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const practice = yield Practice_1.Practice.findOneAndUpdate({
                "lecture.id": lectureID,
            }, { questions });
            res.json({
                statusCode: 200,
                message: "Practice has been updated!",
                status: true,
                data: practice,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Get all attempts by students from lecturer
    app.post(`${basePath}/attempts`, practice_1.validateDefaultPracticeRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, practiceID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const attempts = yield Attempt_1.Attempt.find({
                practiceID,
            });
            res.json({
                statusCode: 200,
                status: true,
                data: attempts,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Get student attempts on a lecture practice
    app.post(`${basePath}/student/attempts`, practice_1.validateDefaultPracticeRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, studentID, practiceID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const attempts = yield Attempt_1.Attempt.find({
                studentID: studentID,
                practiceID,
            });
            res.json({
                statusCode: 200,
                status: true,
                data: attempts,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Get the practice of a lecture by a lecturer or admin
    app.post(`${basePath}/get/:practiceID`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user !== "student") {
            const practice = yield Practice_1.Practice.findOne({
                id: req.params.practiceID,
            });
            res.json({
                statusCode: 200,
                message: "Practice found!",
                status: true,
                data: practice,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    //Get Practice Whitelist
    app.post(`${basePath}/whitelist/get`, practice_1.validateDefaultPracticeRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, practiceID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const whitelist = yield Whitelist_1.Whitelist.findOne({ practiceID });
            res.json({
                status: true,
                statusCode: 200,
                data: whitelist !== null && whitelist !== void 0 ? whitelist : undefined,
                message: whitelist
                    ? "Whitelist found"
                    : "Lecturer has not created whitelist for this practice",
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Add student to whitelist
    app.post(`${basePath}/whitelist/add`, practice_1.validateDefaultPracticeRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, practiceID, studentID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            // Find Whitelist
            const whitelist = yield Whitelist_1.Whitelist.findOne({ practiceID });
            if (!whitelist.students.includes(studentID)) {
                const updatedWhitelist = yield Whitelist_1.Whitelist.findOneAndUpdate({ practiceID }, { students: [...whitelist.students, studentID] });
                res.json({
                    status: true,
                    statusCode: 201,
                    message: "Added to whitelist",
                    data: updatedWhitelist,
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Remove student from whitelist
    app.post(`${basePath}/whitelist/remove`, practice_1.validateDefaultPracticeRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, practiceID, studentID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            // Find Whitelist
            const whitelist = yield Whitelist_1.Whitelist.findOne({ practiceID });
            const updatedWhitelist = yield Whitelist_1.Whitelist.findOneAndUpdate({ practiceID }, { students: whitelist.students.fitler((s) => s !== studentID) });
            res.json({
                status: true,
                statusCode: 201,
                message: "Removed from whitelist",
                data: updatedWhitelist,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Get the practice of a lecture by a student
    app.post(`${basePath}/student/get/:practiceID`, practice_1.validateDefaultPracticeRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { token, courseID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const practiceID = req.params.practiceID;
            const practice = yield Practice_1.Practice.findOne({
                id: practiceID,
            });
            const lecture = yield Lecture_1.Lecture.findOne({
                id: (_b = (_a = practice === null || practice === void 0 ? void 0 : practice.lecture) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "",
                isActive: true,
            });
            const attempts = yield Attempt_1.Attempt.find({ studentID: id });
            const hasStudentCompletedPreceedingLecturePractices = () => __awaiter(this, void 0, void 0, function* () {
                const practices = yield Practice_1.Practice.find({
                    courseID,
                });
                const currentPractice = practices.find((p) => p.id === practiceID);
                if (currentPractice && currentPractice.index === 1) {
                    //This is the first practice
                    return true;
                }
                else {
                    const passed = practices.map((p) => {
                        if (p.index < practice.index) {
                            // Check for attempts for each practice with more than 50 Percent
                            const pass = attempts.filter((a) => a.practiceID === p.id && a.percent >= 50);
                            return pass.length > 0;
                        }
                        else {
                            return true;
                        }
                    });
                    return !passed.includes(false);
                }
                // Check if student has passed each practice
            });
            const resolvedQuestions = practice.questions.map((q) => {
                return {
                    id: q.id,
                    title: q.title,
                    options: q.options,
                    answer: "unset",
                };
            });
            const resolvedPractice = {
                id: practice.id,
                lecture: { title: practice.lecture.title, id: practice.lecture.id },
                questions: (yield hasStudentCompletedPreceedingLecturePractices())
                    ? resolvedQuestions
                    : [],
                index: practice.index,
                dateCreated: practice.dateCreated,
                isEligible: yield hasStudentCompletedPreceedingLecturePractices(),
            };
            res.json({
                statusCode: lecture ? 200 : 401,
                message: lecture
                    ? "Practice found!"
                    : "Unauthorized or Practice does not exist!",
                status: true,
                data: lecture ? resolvedPractice : null,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Submit practice attempt by student
    app.post(`${basePath}/submit`, examination_1.validateStudentSubmissionRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, practiceID, questions } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "student") {
            const practice = yield Practice_1.Practice.findOne({ id: practiceID });
            const attempts = yield Attempt_1.Attempt.find({ studentID: id });
            const isStudentEligible = attempts.length < 3;
            if (isStudentEligible) {
                const practiceQuestions = practice.questions;
                const marksObtainable = practiceQuestions.length;
                const count = questions.map((q) => {
                    const foundQuestion = practiceQuestions.find((eQuestion) => eQuestion.id === q.id);
                    return foundQuestion.answer === q.answer;
                });
                const correctCount = count.filter((val) => val === true);
                const percent = (correctCount.length / marksObtainable) * 100;
                const attempt = yield new Attempt_1.Attempt({
                    id: (0, Methods_1.generateRandomString)(32),
                    practiceID,
                    studentID: id,
                    score: correctCount.length,
                    percent,
                    timestamp: Date.now(),
                }).save();
                res.json({
                    statusCode: 200,
                    status: true,
                    message: "Examination successfully graded!",
                    data: attempt,
                });
            }
            else {
                res.json({
                    statusCode: 401,
                    status: true,
                    message: "You are not eligible to write this examination. Please contact Admin",
                });
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=practice.js.map