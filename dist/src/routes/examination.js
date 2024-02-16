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
const basePath = "/examination";
function default_1(app) {
    app.post(`${basePath}/create`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, title, year, course } = req.body;
        const { id } = (0, JWT_1.verifyToken)(token);
        const lecturer = yield Lecturer_1.Lecturer.findOne({ id });
        if (token && lecturer) {
            const examination = yield new Examination_1.Examination({
                id: (0, Methods_1.generateRandomString)(16),
                title,
                year,
                course,
                completed: false,
                started: false,
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
    app.post(`${basePath}s/all`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id } = (0, JWT_1.verifyToken)(token);
        const lecturer = yield Lecturer_1.Lecturer.findOne({ id });
        if (token && lecturer) {
            const examinations = yield Examination_1.Examination.find({});
            res.json((0, Misc_1.returnSuccessResponseObject)("Examination list obtained!", 200, examinations));
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Unauthorized",
            });
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=examination.js.map