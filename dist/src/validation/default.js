"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const loginValidationSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
const validateLoginRequest = (req, res, next) => {
    const { error } = loginValidationSchema.validate(req.body);
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
exports.validateLoginRequest = validateLoginRequest;
//# sourceMappingURL=default.js.map