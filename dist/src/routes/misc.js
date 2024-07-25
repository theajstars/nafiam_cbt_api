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
const Instructor_1 = require("../models/Instructor");
const Misc_1 = require("../Lib/Misc");
const Methods_1 = require("../Lib/Methods");
const course_1 = require("../validation/course");
const default_1 = require("../validation/default");
const Student_1 = require("../models/Student");
const Admin_1 = require("../models/Admin");
const Data_1 = require("../Lib/Data");
const basePath = "/misc";
function default_2(app) {
    app.get("/", (req, res) => {
        res.json({
            status: "true",
            statusCode: 200,
            message: "Server is live!!",
        });
    });
    app.get("/check", (req, res) => {
        res.json({
            status: "true",
            statusCode: 200,
            message: "Check is heck!!",
        });
    });
    app.post(`${basePath}/ranks/get`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            res.json({
                status: true,
                statusCode: 200,
                message: "List of ranks",
                data: Data_1.nigerianAirForceRanks,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/find`, default_1.validateDefaultFindUserRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, searchString, userCase, rank, gender } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const filter = {
                $or: [
                    {
                        email: { $regex: ".*" + searchString + ".*", $options: "i" },
                    },
                    {
                        serviceNumber: {
                            $regex: ".*" + searchString + ".*",
                            $options: "i",
                        },
                    },
                    {
                        firstName: {
                            $regex: ".*" + searchString + ".*",
                            $options: "i",
                        },
                    },
                    {
                        lastName: {
                            $regex: ".*" + searchString + ".*",
                            $options: "i",
                        },
                    },
                ],
                gender,
                rank,
            };
            switch (userCase) {
                case "student":
                    const students = yield Student_1.Student.find(Object.assign({}, (0, Methods_1.removeEmptyFields)(filter))).select("-password");
                    res.json({
                        status: true,
                        statusCode: 200,
                        message: "Students found!",
                        data: students,
                    });
                    break;
                case "instructor":
                    const instructors = yield Instructor_1.Instructor.find(Object.assign({}, (0, Methods_1.removeEmptyFields)(filter))).select("-password");
                    res.json({
                        status: true,
                        statusCode: 200,
                        message: "Instructors found!",
                        data: instructors,
                    });
                    break;
                case "admin":
                    const admins = yield Admin_1.Admin.find(Object.assign({}, (0, Methods_1.removeEmptyFields)(filter))).select("-password");
                    res.json({
                        status: true,
                        statusCode: 200,
                        message: "Admins found!",
                        data: admins,
                    });
                    break;
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_2;
//# sourceMappingURL=misc.js.map