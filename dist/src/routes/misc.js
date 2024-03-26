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
const Misc_1 = require("../Lib/Misc");
const Methods_1 = require("../Lib/Methods");
const course_1 = require("../validation/course");
const default_1 = require("../validation/default");
const Student_1 = require("../models/Student");
const Admin_1 = require("../models/Admin");
const Log_1 = require("../models/Log");
const basePath = "/misc";
function default_2(app) {
    app.get("/", (req, res) => {
        res.json({
            status: "true",
            statusCode: 200,
            message: "Server is live!!",
        });
    });
    app.post(`${basePath}/ranks/get`, course_1.validateTokenSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const nigerianAirForceRanks = [
                "Marshal of the Nigerian Air Force",
                "Air Chief Marshal",
                "Air Marshal",
                "Air Vice Marshal",
                "Air Commodore",
                "Group Captain",
                "Wing Commander",
                "Squadron Leader",
                "Flight Lieutenant",
                "Flying Officer",
                "Pilot Officer",
                "Air Warrant Officer",
                "Master Warrant Officer",
                "Warrant Officer",
                "Flight Sergeant",
                "Sergeant",
                "Corporal",
                "Lance Corporal",
            ];
            res.json({
                status: true,
                statusCode: 200,
                message: "List of ranks",
                data: nigerianAirForceRanks,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/password/update`, default_1.validateUpdatePasswordRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, newPassword: newPasswordString, oldPassword, user: userCase, navigatorObject, } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            if (user === userCase) {
                const newPassword = yield (0, Methods_1.genPassword)(newPasswordString);
                switch (user) {
                    case "student":
                        var isPasswordCorrect = yield bcryptjs_1.default.compare(oldPassword, (yield Student_1.Student.findOne({ id })).password);
                        if (isPasswordCorrect) {
                            yield Student_1.Student.findOneAndUpdate({ id }, { password: newPassword, isChangedPassword: true });
                            res.json({
                                status: true,
                                statusCode: 200,
                                message: "Your password has been successfully updated!",
                            });
                        }
                        else {
                            res.json(Object.assign(Object.assign({}, Misc_1.UnauthorizedResponseObject), { message: "Incorrect password" }));
                        }
                        break;
                    case "lecturer":
                        var isPasswordCorrect = yield bcryptjs_1.default.compare(oldPassword, (yield Lecturer_1.Lecturer.findOne({ id })).password);
                        if (isPasswordCorrect) {
                            yield Lecturer_1.Lecturer.findOneAndUpdate({ id }, { password: newPassword, isChangedPassword: true });
                            res.json({
                                status: true,
                                statusCode: 200,
                                message: "Your password has been successfully updated!",
                            });
                        }
                        else {
                            res.json(Object.assign(Object.assign({}, Misc_1.UnauthorizedResponseObject), { message: "Incorrect password" }));
                        }
                        break;
                    case "admin":
                        var isPasswordCorrect = yield bcryptjs_1.default.compare(oldPassword, (yield Admin_1.Admin.findOne({ id })).password);
                        if (isPasswordCorrect) {
                            yield Admin_1.Admin.findOneAndUpdate({ id }, { password: newPassword, isChangedPassword: true });
                            res.json({
                                status: true,
                                statusCode: 200,
                                message: "Your password has been successfully updated!",
                            });
                        }
                        else {
                            res.json(Object.assign(Object.assign({}, Misc_1.UnauthorizedResponseObject), { message: "Incorrect password" }));
                        }
                        break;
                }
                const log = yield new Log_1.Log({
                    id: (0, Methods_1.generateRandomString)(32),
                    personnelID: id,
                    timestamp: Date.now(),
                    navigatorObject,
                    comments: isPasswordCorrect
                        ? "Password changed!"
                        : "Password was not changed",
                    userType: user,
                    action: "change_password",
                }).save();
            }
            else {
                res.json(Misc_1.UnauthorizedResponseObject);
            }
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
                case "lecturer":
                    const lecturers = yield Lecturer_1.Lecturer.find(Object.assign({}, (0, Methods_1.removeEmptyFields)(filter))).select("-password");
                    res.json({
                        status: true,
                        statusCode: 200,
                        message: "Lecturers found!",
                        data: lecturers,
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