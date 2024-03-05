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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const default_1 = require("../validation/default");
const course_1 = require("../validation/course");
const JWT_1 = require("../Lib/JWT");
const Student_1 = require("../models/Student");
const Misc_1 = require("../Lib/Misc");
const basePath = "/student";
function default_2(app) {
    app.post(`${basePath}/login`, default_1.validateLoginRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id, password } = req.body;
        const student = yield Student_1.Student.findOne({ serviceNumber: id });
        if (student) {
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, student.password);
            res.json({
                status: true,
                statusCode: isPasswordCorrect ? 200 : 401,
                student: isPasswordCorrect ? student : null,
                token: yield (0, JWT_1.createToken)(student.id, "student"),
            });
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
            });
        }
    }));
    app.post(`${basePath}/profile/get`, course_1.validateTokenSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "student") {
            const student = yield Student_1.Student.findOne({ id }).select("firstName lastName email");
            res.json({
                status: true,
                statusCode: 200,
                data: student,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_2;
//# sourceMappingURL=log.js.map