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
const Misc_1 = require("../Lib/Misc");
const Course_1 = require("../models/Course");
const course_1 = require("../validation/course");
const Material_1 = require("../models/Material");
const basePath = "/course";
function default_1(app) {
    app.post(`${basePath}s/all`, course_1.validateGetAllCourses, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (user === "admin") {
            const course = Course_1.Course.find({});
            res.json({
                status: true,
                statusCode: 201,
                message: "Course created successfully!",
                data: course,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}s/lecturer/all`, course_1.validateGetAllCourses, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, lecturerID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (user === "lecturer") {
            const courses = yield Course_1.Course.find({ lecturerID: lecturerID !== null && lecturerID !== void 0 ? lecturerID : id });
            res.json({
                status: true,
                statusCode: 200,
                message: "Courses found!",
                data: courses,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/get`, course_1.validateGetSingleCourseSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, courseID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (user === "lecturer" || user === "admin") {
            const course = yield Course_1.Course.findOne({ id: courseID });
            res.json({
                status: true,
                statusCode: 200,
                message: "Course details retrieved!",
                data: course,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/create`, course_1.validateCreateCourse, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { title, code, description, department, token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (user === "admin" || user === "lecturer") {
            const course = yield new Course_1.Course({
                id: (0, Methods_1.generateRandomString)(16),
                lecturerID: id,
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
    }));
    app.post(`${basePath}/update`, course_1.validateUpdateCourse, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { courseID, title, code, description, department, token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (user === "admin" || user === "lecturer") {
            const course = yield Course_1.Course.findOneAndUpdate({ id: courseID }, {
                title,
                code,
                description,
                department,
            });
            res.json({
                status: true,
                statusCode: 201,
                message: "Course details updated successfully!",
                data: course,
            });
        }
    }));
    app.post(`${basePath}/material/create`, course_1.validateCreateCourseMaterial, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { courseID, token, title, description, type, category, file } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (user === "admin" || user === "lecturer") {
            const courseMaterial = yield new Material_1.Material({
                id: (0, Methods_1.generateRandomString)(16),
                courseID,
                title,
                description,
                type,
                category,
                file,
            }).save();
            res.json({
                status: true,
                statusCode: 201,
                message: "Course Material uploaded successfully!",
                data: courseMaterial,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    app.post(`${basePath}/materials/get`, course_1.validateGetAllCourseMaterials, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { courseID, token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (user === "admin" || user === "lecturer") {
            const materials = yield Material_1.Material.find({ courseID });
            res.json({
                status: true,
                statusCode: 200,
                message: "Found materials!",
                data: materials,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=course.js.map