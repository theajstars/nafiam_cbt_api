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
const basePath = "/lecture";
function default_1(app) {
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
    app.post(`${basePath}s/get`, lecture_1.validateDefaultLectureRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
}
exports.default = default_1;
//# sourceMappingURL=lecture.js.map