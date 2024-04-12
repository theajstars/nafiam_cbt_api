"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCourseEnrollmentRequest = exports.validateDeleteCourseMaterialSchema = exports.validateGetAllCourseMaterials = exports.validateCreateCourseMaterial = exports.validateUpdateCourse = exports.validateGetSingleCourseSchema = exports.validateGetAllCourses = exports.validateCreateCourse = exports.validateTokenSchema = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const tokenSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
});
const validateTokenSchema = (req, res, next) => {
    const { error } = tokenSchema.validate(req.body);
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
    else {
        next();
    }
};
exports.validateTokenSchema = validateTokenSchema;
const createSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    code: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    school: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    lecturerID: joi_1.default.string().optional(),
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
    else {
        next();
    }
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
    else {
        next();
    }
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
    else {
        next();
    }
};
exports.validateGetSingleCourseSchema = validateGetSingleCourseSchema;
const updateSchema = joi_1.default.object({
    courseID: joi_1.default.string().required(),
    token: joi_1.default.string().required(),
    code: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    school: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
});
const validateUpdateCourse = (req, res, next) => {
    const { error } = updateSchema.validate(req.body);
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
    else {
        next();
    }
};
exports.validateUpdateCourse = validateUpdateCourse;
const createCourseMaterialSchema = joi_1.default.object({
    courseID: joi_1.default.string().required(),
    token: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    type: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
    file: joi_1.default.string().required(),
});
const validateCreateCourseMaterial = (req, res, next) => {
    const { error } = createCourseMaterialSchema.validate(req.body);
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
    else {
        next();
    }
};
exports.validateCreateCourseMaterial = validateCreateCourseMaterial;
const getAllCourseMaterialsSchema = joi_1.default.object({
    courseID: joi_1.default.string().required(),
    token: joi_1.default.string().required(),
});
const validateGetAllCourseMaterials = (req, res, next) => {
    const { error } = getAllCourseMaterialsSchema.validate(req.body);
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
    else {
        next();
    }
};
exports.validateGetAllCourseMaterials = validateGetAllCourseMaterials;
const deleteCourseMaterialSchema = joi_1.default.object({
    materialID: joi_1.default.string().required(),
    token: joi_1.default.string().required(),
});
const validateDeleteCourseMaterialSchema = (req, res, next) => {
    const { error } = deleteCourseMaterialSchema.validate(req.body);
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
    else {
        next();
    }
};
exports.validateDeleteCourseMaterialSchema = validateDeleteCourseMaterialSchema;
const courseEnrollSchema = joi_1.default.object({
    courseID: joi_1.default.string().required(),
    token: joi_1.default.string().required(),
});
const validateCourseEnrollmentRequest = (req, res, next) => {
    const { error } = courseEnrollSchema.validate(req.body);
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
    else {
        next();
    }
};
exports.validateCourseEnrollmentRequest = validateCourseEnrollmentRequest;
//# sourceMappingURL=course.js.map