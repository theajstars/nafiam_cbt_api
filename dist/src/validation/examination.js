"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStudentBlacklistRequest = exports.validateStudentSubmissionRequest = exports.validateExaminationPasswordRequest = exports.validateAddStudentsToExaminationRequest = exports.validateApproveExaminationRequest = exports.validateEditExaminationRequest = exports.validateCreateExaminationSchema = exports.validateGetSingleExaminationBatchRequest = exports.validateCreateExaminationBatchRequest = exports.validateDefaultBatchRequest = exports.validateDefaultExaminationRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const defaultExaminationSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().optional(),
    batchID: joi_1.default.string().optional(),
    isAdmin: joi_1.default.boolean().optional(),
});
const validateDefaultExaminationRequest = (req, res, next) => {
    const { error } = defaultExaminationSchema.validate(req.body);
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
exports.validateDefaultExaminationRequest = validateDefaultExaminationRequest;
const defaultBatchSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    batchID: joi_1.default.string().required(),
    isAdmin: joi_1.default.boolean().optional(),
});
const validateDefaultBatchRequest = (req, res, next) => {
    const { error } = defaultBatchSchema.validate(req.body);
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
exports.validateDefaultBatchRequest = validateDefaultBatchRequest;
const createExminationBatchSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().required(),
    students: joi_1.default.array().required(),
    batch: joi_1.default.number().required(),
});
const validateCreateExaminationBatchRequest = (req, res, next) => {
    const { error } = createExminationBatchSchema.validate(req.body);
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
exports.validateCreateExaminationBatchRequest = validateCreateExaminationBatchRequest;
const getSingleExaminationBatchSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    batchID: joi_1.default.string().required(),
});
const validateGetSingleExaminationBatchRequest = (req, res, next) => {
    const { error } = getSingleExaminationBatchSchema.validate(req.body);
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
exports.validateGetSingleExaminationBatchRequest = validateGetSingleExaminationBatchRequest;
const createExaminationSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    date: joi_1.default.number().required(),
    duration: joi_1.default.string().required(),
});
const validateCreateExaminationSchema = (req, res, next) => {
    const { error } = createExaminationSchema.validate(req.body);
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
exports.validateCreateExaminationSchema = validateCreateExaminationSchema;
const editExaminationSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().required(),
    questions: joi_1.default.any().required(),
    title: joi_1.default.string().required(),
    date: joi_1.default.number().required(),
});
const validateEditExaminationRequest = (req, res, next) => {
    const { error } = editExaminationSchema.validate(req.body);
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
exports.validateEditExaminationRequest = validateEditExaminationRequest;
const approveExaminationSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().required(),
    questions: joi_1.default.any().required(),
    isAdmin: joi_1.default.boolean().optional(),
});
const validateApproveExaminationRequest = (req, res, next) => {
    const { error } = approveExaminationSchema.validate(req.body);
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
exports.validateApproveExaminationRequest = validateApproveExaminationRequest;
const addStudentsToExaminationSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().required(),
    students: joi_1.default.any().required(),
});
const validateAddStudentsToExaminationRequest = (req, res, next) => {
    const { error } = addStudentsToExaminationSchema.validate(req.body);
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
exports.validateAddStudentsToExaminationRequest = validateAddStudentsToExaminationRequest;
const validateExaminationPasswordSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    batchID: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
const validateExaminationPasswordRequest = (req, res, next) => {
    const { error } = validateExaminationPasswordSchema.validate(req.body);
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
exports.validateExaminationPasswordRequest = validateExaminationPasswordRequest;
const studentSubmitSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().optional(),
    batchID: joi_1.default.string().optional(),
    practiceID: joi_1.default.string().optional(),
    questions: joi_1.default.any().required(),
});
const validateStudentSubmissionRequest = (req, res, next) => {
    const { error } = studentSubmitSchema.validate(req.body);
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
exports.validateStudentSubmissionRequest = validateStudentSubmissionRequest;
const studentBlacklistSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    batchID: joi_1.default.string().required(),
    studentID: joi_1.default.string().required(),
    action: joi_1.default.string().required(),
});
const validateStudentBlacklistRequest = (req, res, next) => {
    const { error } = studentBlacklistSchema.validate(req.body);
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
exports.validateStudentBlacklistRequest = validateStudentBlacklistRequest;
//# sourceMappingURL=examination.js.map