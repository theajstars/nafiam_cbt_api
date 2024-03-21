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
const Misc_1 = require("../Lib/Misc");
const Methods_1 = require("../Lib/Methods");
const course_1 = require("../validation/course");
const default_1 = require("../validation/default");
const Student_1 = require("../models/Student");
const Admin_1 = require("../models/Admin");
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
        const { token, password, user: userCase } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            if (user === userCase) {
                const newPassword = yield (0, Methods_1.genPassword)(password);
                switch (userCase) {
                    case "student":
                        Student_1.Student.findOneAndUpdate({ id }, { password: newPassword, isChangedPassword: true });
                        break;
                    case "lecturer":
                        Lecturer_1.Lecturer.findOneAndUpdate({ id }, { password: newPassword, isChangedPassword: true });
                        break;
                    case "admin":
                        Admin_1.Admin.findOneAndUpdate({ id }, { password: newPassword, isChangedPassword: true });
                        break;
                }
                res.json({
                    status: true,
                    statusCode: 200,
                    data: {},
                    message: "Your password has been successfully updated!",
                });
            }
            else {
                res.json(Misc_1.UnauthorizedResponseObject);
            }
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_2;
//# sourceMappingURL=misc.js.map