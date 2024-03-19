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
const basePath = "/result";
function default_1(app) {
    app.post(`${basePath}/get`, student_1.validateGetSingleResultRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID, studentID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const result = yield Results_1.Result.findOne({
                examinationID,
                studentID: user === "student" ? id : studentID,
            });
            res.json({
                status: true,
                statusCode: 200,
                message: "Result found!",
                data: result,
            });
        }
    }));
    app.post(`${basePath}s/get`, course_1.validateTokenSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, examinationID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user !== "student") {
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
}
exports.default = default_1;
//# sourceMappingURL=result.js.map