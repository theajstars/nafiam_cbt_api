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
const Misc_1 = require("../Lib/Misc");
const lecture_1 = require("../validation/lecture");
const Lecture_1 = require("../models/Lecture");
const Methods_1 = require("../Lib/Methods");
const Practice_1 = require("../models/Practice");
const Whitelist_1 = require("../models/Whitelist");
const lecture_2 = require("./lecture");
function default_1(app) {
    // Create a new Lecture
    app.post(`${lecture_2.basePath}/create`, lecture_1.validateCreateLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { title, courseID, description, files, token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            //Get Existing lectures for the course
            const lectures = yield Lecture_1.Lecture.find({ courseID });
            const index = lectures.length + 1;
            // Create Lecture, Whitelist and Practice
            const lecture = yield new Lecture_1.Lecture({
                id: (0, Methods_1.generateRandomString)(32),
                title,
                description,
                courseID,
                dateCreated: Date.now(),
                files,
                isActive: false,
            }).save();
            const practice = yield new Practice_1.Practice({
                id: (0, Methods_1.generateRandomString)(32),
                lecture: {
                    id: (_a = lecture === null || lecture === void 0 ? void 0 : lecture.id) !== null && _a !== void 0 ? _a : "",
                    title: (_b = lecture === null || lecture === void 0 ? void 0 : lecture.title) !== null && _b !== void 0 ? _b : "",
                },
                courseID,
                index,
                questions: [],
                dateCreated: Date.now(),
            }).save();
            const whitelist = yield new Whitelist_1.Whitelist({
                id: (0, Methods_1.generateRandomString)(32),
                practiceID: practice.id,
                students: [],
                lastUpdated: Date.now(),
            }).save();
            // Update lecture to include practiceID
            yield Lecture_1.Lecture.findOneAndUpdate({ id: lecture === null || lecture === void 0 ? void 0 : lecture.id }, { practiceID: practice.id });
            res.json({
                statusCode: 201,
                message: "Lecture has been added!",
                status: true,
                data: { lecture, practice, whitelist },
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Get all lectures for a course
    app.post(`${lecture_2.basePath}s/all`, lecture_1.validateDefaultLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
    app.post(`${lecture_2.basePath}/get/:lectureID`, lecture_1.validateDefaultLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
    app.post(`${lecture_2.basePath}/status/:lectureID`, lecture_1.validateToggleLectureStatusRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, status } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            // Check if Lecture Practice is completed
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
    app.post(`${lecture_2.basePath}/update/:lectureID`, lecture_1.validateUpdateLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _c;
        const { lectureID, title, description, files, token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const lecture = yield Lecture_1.Lecture.findOneAndUpdate({
                id: (_c = req.params.lectureID) !== null && _c !== void 0 ? _c : lectureID,
            }, { title, description, files });
            const practice = yield Practice_1.Practice.findOneAndUpdate({
                "lecture.id": lectureID,
            }, { lecture: { title: title, id: lectureID } });
            res.json({
                statusCode: 200,
                message: "Lecture has been updated!",
                status: true,
                data: { lecture, practice },
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    //Delete a single lecture, this will also delete the lecture's practice questions
    app.delete(`${lecture_2.basePath}/delete`, lecture_1.validateDefaultLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, lectureID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "lecturer") {
            const lecture = yield Lecture_1.Lecture.findOneAndDelete({ id: lectureID });
            const practice = yield Practice_1.Practice.findOneAndDelete({
                "lecture.id": lectureID,
            });
            res.json({
                statusCode: 204,
                message: "Lecture has been deleted!",
                status: true,
                data: { lecture, practice },
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=newFile.js.map