"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToggleLectureStatusRequest = exports.validateCreatePracticeQuestionsRequest = exports.validateUpdateLectureRequest = exports.validateCreateLectureRequest = exports.validateDefaultLectureRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const defaultLectureRequestSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    courseID: joi_1.default.string().optional(),
    lectureID: joi_1.default.string().optional(),
});
const validateDefaultLectureRequest = (req, res, next) => {
    const { error } = defaultLectureRequestSchema.validate(req.body);
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
exports.validateDefaultLectureRequest = validateDefaultLectureRequest;
const lectureCreateSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    courseID: joi_1.default.string().required(),
    files: joi_1.default.array().required(),
});
const validateCreateLectureRequest = (req, res, next) => {
    const { error } = lectureCreateSchema.validate(req.body);
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
exports.validateCreateLectureRequest = validateCreateLectureRequest;
const lectureUpdateSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    lectureID: joi_1.default.string().optional(),
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    files: joi_1.default.array().required(),
});
const validateUpdateLectureRequest = (req, res, next) => {
    const { error } = lectureUpdateSchema.validate(req.body);
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
exports.validateUpdateLectureRequest = validateUpdateLectureRequest;
const createPracticeQuestionsSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    lectureID: joi_1.default.string().required(),
    questions: joi_1.default.array().required(),
});
const validateCreatePracticeQuestionsRequest = (req, res, next) => {
    const { error } = createPracticeQuestionsSchema.validate(req.body);
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
exports.validateCreatePracticeQuestionsRequest = validateCreatePracticeQuestionsRequest;
const toggleLectureStatusSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    status: joi_1.default.boolean().required(),
});
const validateToggleLectureStatusRequest = (req, res, next) => {
    const { error } = toggleLectureStatusSchema.validate(req.body);
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
exports.validateToggleLectureStatusRequest = validateToggleLectureStatusRequest;
//# sourceMappingURL=lecture.js.map