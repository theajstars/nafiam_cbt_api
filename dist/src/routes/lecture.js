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
const basePath = "/lecture";
function default_1(app) {
    // Create a new Lecture
    app.post(`${basePath}/create`, lecture_1.validateCreateLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { title, courseID, description, files, token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const lecture = yield new Lecture_1.Lecture({
                id: (0, Methods_1.generateRandomString)(32),
                title,
                description,
                courseID,
                dateCreated: Date.now(),
                files,
                isActive: false,
            }).save();
            res.json({
                statusCode: 201,
                message: "Lecture has been added!",
                status: true,
                data: lecture,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Get all lectures for a course
    app.post(`${basePath}s/all`, lecture_1.validateDefaultLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, courseID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const lectures = yield Lecture_1.Lecture.find({ courseID });
            res.json({
                statusCode: 200,
                message: "Lectures found!",
                status: true,
                data: lectures,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Get details for a single lecture
    app.post(`${basePath}/get/:lectureID`, lecture_1.validateDefaultLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const lecture = yield Lecture_1.Lecture.findOne({ id: req.params.lectureID });
            res.json({
                statusCode: 200,
                message: "Lecture found!",
                status: true,
                data: lecture,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Update active status for a single lecture
    app.post(`${basePath}/status/:lectureID`, lecture_1.validateToggleLectureStatusRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, status } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const lecture = yield Lecture_1.Lecture.findOneAndUpdate({ id: req.params.lectureID }, { isActive: status });
            res.json({
                statusCode: 200,
                message: status
                    ? "Lecture has been activated!"
                    : "Lecture has been deactivated",
                status: true,
                data: lecture,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Update details of a single lecture
    app.post(`${basePath}/update/:lectureID`, lecture_1.validateUpdateLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { lectureID, title, description, files, token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const lecture = yield Lecture_1.Lecture.findOneAndUpdate({
                id: (_a = req.params.lectureID) !== null && _a !== void 0 ? _a : lectureID,
            }, { title, description, files });
            res.json({
                statusCode: 200,
                message: "Lecture has been updated!",
                status: true,
                data: lecture,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.delete(`${basePath}/delete`, lecture_1.validateDefaultLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, lectureID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const lecture = yield Lecture_1.Lecture.findOneAndDelete({ id: lectureID });
            res.json({
                statusCode: 204,
                message: "Lecture has been deleted!",
                status: true,
                data: lecture,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/practice/create`, lecture_1.validateCreatePracticeQuestionsRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, lectureID, questions } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const practice = yield new Practice_1.Practice({
                id: (0, Methods_1.generateRandomString)(32),
                lectureID,
                questions,
                dateCreated: Date.now(),
            }).save();
            res.json({
                statusCode: 201,
                message: "New practice has been created!",
                status: true,
                data: practice,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/practice/get/:lectureID`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const practices = yield Practice_1.Practice.findOne({
                lectureID: req.params.lectureID,
            });
            res.json({
                statusCode: 200,
                message: "Practice found!",
                status: true,
                data: practices,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=lecture.js.map