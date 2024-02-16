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
const JWT_1 = require("../Lib/JWT");
const Lecturer_1 = require("../models/Lecturer");
const basePath = "/lecturer";
function default_1(app) {
    app.post(`${basePath}/login`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id, password } = req.body;
        const lecturer = yield Lecturer_1.Lecturer.findOne({ email: id });
        if (lecturer) {
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, lecturer.password);
            res.json({
                status: true,
                statusCode: isPasswordCorrect ? 200 : 401,
                message: "Logged In!",
                token: yield (0, JWT_1.createToken)(lecturer.id, "lecturer"),
            });
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Invalid email and password",
            });
        }
    }));
    app.post(`${basePath}/profile/get`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id } = (0, JWT_1.verifyToken)(token);
        const lecturer = yield Lecturer_1.Lecturer.findOne({ id }).select("email firstName lastName id rank");
        if (lecturer) {
            console.log(lecturer);
            res.json({
                status: true,
                statusCode: 200,
                data: lecturer,
                message: "Profile successfully retrieved!",
            });
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
                message: "Invalid email and password",
            });
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=examination.js.map