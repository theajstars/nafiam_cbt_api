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
const Lecture_1 = require("../models/Lecture");
const Methods_1 = require("../Lib/Methods");
const Practice_1 = require("../models/Practice");
const practice_1 = require("../validation/practice");
const Attempt_1 = require("../models/Attempt");
const examination_1 = require("../validation/examination");
const basePath = "/practice";
function default_1(app) {
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
    // Get the practice of a lecture by a student
    app.post(`${basePath}/student/get/:practiceID`, practice_1.validateDefaultPracticeRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { token, courseID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const practice = yield Practice_1.Practice.findOne({
                id: req.params.practiceID,
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
                // Check if student has passed each practice
                const checkArray = practices.map((p) => {
                    if (p.index < practice.index) {
                        const studentAttempts = attempts.filter((a) => a.practiceID === p.id);
                        if (studentAttempts.length === 0) {
                            // 'relevant' refers to if a practice must be passed beforehand
                            return {
                                relevant: true,
                                passed: false,
                            };
                        }
                        else {
                            // Return true if attempt exists with more than 50%
                            const findPass = studentAttempts.find((s) => s.percent >= 50);
                            if (findPass && findPass.percent >= 50) {
                                return {
                                    relevant: true,
                                    passed: true,
                                };
                            }
                            else {
                                return { relevant: true, passed: true };
                            }
                        }
                    }
                    else {
                        return {
                            relevant: false,
                            passed: false,
                        };
                    }
                });
                console.log(checkArray);
                const canUserProceed = () => {
                    return checkArray.length === 0
                        ? false
                        : checkArray.filter((c) => c.relevant === true && c.passed === false).length !== 0
                            ? false
                            : true;
                };
                return canUserProceed();
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
                questions: resolvedQuestions,
                index: practice.index,
                dateCreated: practice.dateCreated,
            };
            res.json({
                statusCode: lecture ? 200 : 401,
                message: lecture
                    ? "Practice found!"
                    : "Unauthorized or Practice does not exist!",
                status: true,
                data: lecture ? resolvedPractice : null,
                mess: yield hasStudentCompletedPreceedingLecturePractices(),
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