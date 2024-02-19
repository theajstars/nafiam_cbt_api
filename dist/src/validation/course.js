"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateCourse = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const createSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
});
const validateCreateCourse = (req, res, next) => {
    const { error } = createSchema.validate(req.body);
    console.log(error, error);
    const errorResponse = error.details.map((e) => {
        return e.message;
    });
    if (error) {
        res.json({
            status: true,
            statusCode: 400,
            message: errorResponse.toString(),
        });
    }
    next();
};
exports.validateCreateCourse = validateCreateCourse;
//# sourceMappingURL=course.js.map