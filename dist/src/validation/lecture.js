"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreatePracticeQuestionsRequest = exports.validateCreateLectureRequest = exports.validateDefaultLectureRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const defaultLectureRequestSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    courseID: joi_1.default.string().required(),
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
//# sourceMappingURL=lecture.js.map