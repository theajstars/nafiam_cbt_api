"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDefaultPracticeRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const defaultPracticeSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    lectureID: joi_1.default.string().optional(),
    practiceID: joi_1.default.string().optional(),
    studentID: joi_1.default.string().optional(),
    courseID: joi_1.default.string().optional(),
});
const validateDefaultPracticeRequest = (req, res, next) => {
    const { error } = defaultPracticeSchema.validate(req.body);
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
exports.validateDefaultPracticeRequest = validateDefaultPracticeRequest;
//# sourceMappingURL=practice.js.map