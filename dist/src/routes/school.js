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
const Schools_1 = require("../models/Schools");
const Misc_1 = require("../Lib/Misc");
const Methods_1 = require("../Lib/Methods");
const admin_1 = require("../validation/admin");
const Lecturer_1 = require("../models/Lecturer");
const Course_1 = require("../models/Course");
const Lecture_1 = require("../models/Lecture");
const Practice_1 = require("../models/Practice");
const Examination_1 = require("../models/Examination");
const basePath = "/school";
function default_1(app) {
    app.post(`${basePath}s/all`, course_1.validateTokenRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const schools = yield Schools_1.School.find();
            res.json({
                status: true,
                statusCode: 200,
                data: schools,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/get`, admin_1.validateSingleSchoolRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, schoolID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const school = yield Schools_1.School.findOne({ id: schoolID });
            const lecturer = yield Lecturer_1.Lecturer.findOne({
                id: school ? school.dean : "",
            }).select("rank gender role serviceNumber email firstName lastName id");
            const courses = yield Course_1.Course.find({ school: schoolID });
            res.json({
                status: true,
                statusCode: 200,
                data: {
                    school,
                    dean: lecturer,
                    courses,
                },
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/create`, admin_1.validateCreateSchoolRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, name, dean } = req.body;
        // 'dean' refers to lecturer ID
        // Dean is NOT required for creating schools
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const school = yield new Schools_1.School({
                id: (0, Methods_1.generateRandomString)(32),
                name,
                dean: dean !== null && dean !== void 0 ? dean : "",
            }).save();
            res.json({
                status: true,
                statusCode: 201,
                data: school,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/update`, admin_1.validateUpdateSchoolRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, name, dean, schoolID } = req.body;
        // 'dean' refers to lecturer ID
        // Dean is REQUIRED for updating schools
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const school = yield Schools_1.School.findOneAndUpdate({ id: schoolID }, {
                name,
                dean,
            });
            res.json({
                status: true,
                statusCode: 200,
                data: school,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.delete(`${basePath}/delete`, admin_1.validateSingleSchoolRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, schoolID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const school = yield Schools_1.School.findOneAndDelete({ id: schoolID });
            const coursesUnderSchool = yield Course_1.Course.find({ school: schoolID });
            coursesUnderSchool.map((c) => () => __awaiter(this, void 0, void 0, function* () {
                const lecture = yield Lecture_1.Lecture.deleteMany({ courseID: c.id });
                const practice = yield Practice_1.Practice.deleteMany({ courseID: c.id });
                const examination = yield Examination_1.Examination.deleteMany({ course: c.id });
                return { lecture, practice, examination };
            }));
            const deleteCourses = yield Course_1.Course.deleteMany({ school: schoolID });
            res.json({
                status: true,
                statusCode: 200,
                data: { school, deleteCourses },
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=school.js.map