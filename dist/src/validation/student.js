"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePasswordRequest = exports.validateGetOneStudentAllResultRequest = exports.validateGetAllStudentinResultsRequest = exports.validateGetSingleResultRequest = exports.validateUpdateStudentProfileRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const updateStudentProfileSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
});
const validateUpdateStudentProfileRequest = (req, res, next) => {
    const { error } = updateStudentProfileSchema.validate(req.body);
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
exports.validateUpdateStudentProfileRequest = validateUpdateStudentProfileRequest;
const getSingleResultSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().required(),
    studentID: joi_1.default.string().optional(),
});
const validateGetSingleResultRequest = (req, res, next) => {
    const { error } = getSingleResultSchema.validate(req.body);
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
exports.validateGetSingleResultRequest = validateGetSingleResultRequest;
const getAllStudentResultsSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().required(),
    studentID: joi_1.default.string().optional(),
});
const validateGetAllStudentinResultsRequest = (req, res, next) => {
    const { error } = getAllStudentResultsSchema.validate(req.body);
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
exports.validateGetAllStudentinResultsRequest = validateGetAllStudentinResultsRequest;
const getOneStudentAllResultSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    studentID: joi_1.default.string().optional(),
});
const validateGetOneStudentAllResultRequest = (req, res, next) => {
    const { error } = getOneStudentAllResultSchema.validate(req.body);
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
exports.validateGetOneStudentAllResultRequest = validateGetOneStudentAllResultRequest;
const updatePasswordSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    user: joi_1.default.allow(["student", "lecturer", "admin"]).required(),
});
const validateUpdatePasswordRequest = (req, res, next) => {
    const { error } = updatePasswordSchema.validate(req.body);
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
exports.validateUpdatePasswordRequest = validateUpdatePasswordRequest;
//# sourceMappingURL=student.js.map