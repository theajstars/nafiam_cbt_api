"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetSingleCourseSchema = exports.validateGetAllCourses = exports.validateCreateCourse = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const createSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    code: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    department: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
});
const validateCreateCourse = (req, res, next) => {
    const { error } = createSchema.validate(req.body);
    if (error) {
        const errorResponse = error.details.map((e) => {
            return e.message;
        });
        res.json({
            status: true,
            statusCode: 400,
            message: errorResponse.toString(),
        });
    }
    next();
};
exports.validateCreateCourse = validateCreateCourse;
const getAllSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    lecturerID: joi_1.default.string().optional(),
});
const validateGetAllCourses = (req, res, next) => {
    const { error } = getAllSchema.validate(req.body);
    if (error) {
        const errorResponse = error.details.map((e) => {
            return e.message;
        });
        res.json({
            status: true,
            statusCode: 400,
            message: errorResponse.toString(),
        });
    }
    next();
};
exports.validateGetAllCourses = validateGetAllCourses;
const getSingleSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    courseID: joi_1.default.string().required(),
});
const validateGetSingleCourseSchema = (req, res, next) => {
    const { error } = getSingleSchema.validate(req.body);
    if (error) {
        const errorResponse = error.details.map((e) => {
            return e.message;
        });
        res.json({
            status: true,
            statusCode: 400,
            message: errorResponse.toString(),
        });
    }
    next();
};
exports.validateGetSingleCourseSchema = validateGetSingleCourseSchema;
//# sourceMappingURL=course.js.map