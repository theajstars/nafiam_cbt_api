"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetAllExaminations = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const getAllExaminationsSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    isAdmin: joi_1.default.boolean().optional(),
});
const validateGetAllExaminations = (req, res, next) => {
    const { error } = getAllExaminationsSchema.validate(req.body);
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
exports.validateGetAllExaminations = validateGetAllExaminations;
//# sourceMappingURL=examination.js.map