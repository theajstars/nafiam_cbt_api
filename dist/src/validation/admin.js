"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateAdminRequest = exports.validateCreateAdminRequest = exports.validateSingleSchoolRequest = exports.validateUpdateSchoolRequest = exports.validateCreateSchoolRequest = exports.validateUpdateStudent = exports.validateSingleInstructorRequest = exports.validateUpdateInstructor = exports.validateCreateInstructor = exports.validateOnboardStudent = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const onboardstudentSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    rank: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    role: joi_1.default.string().required(),
    serviceNumber: joi_1.default.string().required().allow(""),
    school: joi_1.default.string().required(),
});
const validateOnboardStudent = (req, res, next) => {
    const { error } = onboardstudentSchema.validate(req.body);
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
exports.validateOnboardStudent = validateOnboardStudent;
const createInstructorSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    rank: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    role: joi_1.default.string().required(),
    serviceNumber: joi_1.default.string().required().allow(""),
    school: joi_1.default.string().required(),
});
const validateCreateInstructor = (req, res, next) => {
    const { error } = createInstructorSchema.validate(req.body);
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
exports.validateCreateInstructor = validateCreateInstructor;
const updateInstructorSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    instructorID: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    rank: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    role: joi_1.default.string().required(),
    serviceNumber: joi_1.default.string().required().allow(""),
    school: joi_1.default.string().required(),
});
const validateUpdateInstructor = (req, res, next) => {
    const { error } = updateInstructorSchema.validate(req.body);
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
exports.validateUpdateInstructor = validateUpdateInstructor;
const singleInstructorSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    instructorID: joi_1.default.string().required(),
});
const validateSingleInstructorRequest = (req, res, next) => {
    const { error } = singleInstructorSchema.validate(req.body);
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
exports.validateSingleInstructorRequest = validateSingleInstructorRequest;
const updateStudentSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    studentID: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    rank: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    school: joi_1.default.string().required(),
    role: joi_1.default.string().required(),
    serviceNumber: joi_1.default.string().required().allow(""),
});
const validateUpdateStudent = (req, res, next) => {
    const { error } = updateStudentSchema.validate(req.body);
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
exports.validateUpdateStudent = validateUpdateStudent;
const createSchoolSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    dean: joi_1.default.string().optional().allow(""),
});
const validateCreateSchoolRequest = (req, res, next) => {
    const { error } = createSchoolSchema.validate(req.body);
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
exports.validateCreateSchoolRequest = validateCreateSchoolRequest;
const updateSchoolSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    schoolID: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    dean: joi_1.default.string().required(),
});
const validateUpdateSchoolRequest = (req, res, next) => {
    const { error } = updateSchoolSchema.validate(req.body);
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
exports.validateUpdateSchoolRequest = validateUpdateSchoolRequest;
const singleSchoolSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    schoolID: joi_1.default.string().required(),
});
const validateSingleSchoolRequest = (req, res, next) => {
    const { error } = singleSchoolSchema.validate(req.body);
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
exports.validateSingleSchoolRequest = validateSingleSchoolRequest;
const createAdminSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    serviceNumber: joi_1.default.string().required(),
    rank: joi_1.default.string().required(),
});
const validateCreateAdminRequest = (req, res, next) => {
    const { error } = createAdminSchema.validate(req.body);
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
exports.validateCreateAdminRequest = validateCreateAdminRequest;
const updateAdminSchema = joi_1.default.object({
    adminID: joi_1.default.string().required(),
    token: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    serviceNumber: joi_1.default.string().required(),
    rank: joi_1.default.string().required(),
});
const validateUpdateAdminRequest = (req, res, next) => {
    const { error } = updateAdminSchema.validate(req.body);
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
exports.validateUpdateAdminRequest = validateUpdateAdminRequest;
//# sourceMappingURL=admin.js.map