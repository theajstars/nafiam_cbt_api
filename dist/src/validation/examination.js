"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateExaminationBatchRequest = exports.validateGetSingleBatchRequest = exports.validateStudentBlacklistRequest = exports.validateStudentSubmissionRequest = exports.validateExaminationPasswordRequest = exports.validateApproveExaminationRequest = exports.validateEditExaminationRequest = exports.validateCreateExaminationSchema = exports.validateDefaultExaminationRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const defaultExaminationSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().optional(),
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
    duration: joi_1.default.string().required(),
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
const validateExaminationPasswordSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().required(),
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
    examinationID: joi_1.default.string().required(),
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
const getSingleBatchSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    batchID: joi_1.default.string().required(),
});
const validateGetSingleBatchRequest = (req, res, next) => {
    const { error } = getSingleBatchSchema.validate(req.body);
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
exports.validateGetSingleBatchRequest = validateGetSingleBatchRequest;
const createExaminationBatchSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().required(),
    batch: joi_1.default.number().required(),
    students: joi_1.default.any().required(),
});
const validateCreateExaminationBatchRequest = (req, res, next) => {
    const { error } = createExaminationBatchSchema.validate(req.body);
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
//# sourceMappingURL=examination.js.map