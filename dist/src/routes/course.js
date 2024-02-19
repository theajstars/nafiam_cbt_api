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
const Methods_1 = require("../Lib/Methods");
const Course_1 = require("../models/Course");
const basePath = "/course";
function default_1(app) {
    app.post(`${basePath}/create`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { title, code, description, department, token } = req.body;
        if (!token) {
            res.json({
                status: true,
                statusCode: 401,
                message: "Unauthorized",
            });
        }
        else {
            const { id, user } = (0, JWT_1.verifyToken)(token);
            if (user === "admin" || user === "lecturer") {
                const course = yield new Course_1.Course({
                    id: (0, Methods_1.generateRandomString)(16),
                    title,
                    code,
                    description,
                    department,
                }).save();
                res.json({
                    status: true,
                    statusCode: 201,
                    message: "Course created successfully!",
                    data: course,
                });
            }
            else {
                res.json({
                    status: true,
                    statusCode: 401,
                    message: "Unauthorized",
                });
            }
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=course.js.map