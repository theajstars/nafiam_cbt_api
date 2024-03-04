"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEditExaminationRequest = exports.validateCreateExaminationSchema = exports.validateDefaultExaminationRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const defaultExaminationSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().required(),
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
    year: joi_1.default.string().required(),
    course: joi_1.default.string().required(),
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
    year: joi_1.default.string().required(),
    course: joi_1.default.string().required(),
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
//# sourceMappingURL=examination.js.map