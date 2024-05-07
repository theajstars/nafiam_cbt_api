"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDefaultInstructorRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const defaultInstructorSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    instructorID: joi_1.default.string().optional(),
});
const validateDefaultInstructorRequest = (req, res, next) => {
    const { error } = defaultInstructorSchema.validate(req.body);
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
exports.validateDefaultInstructorRequest = validateDefaultInstructorRequest;
//# sourceMappingURL=instructor.js.map