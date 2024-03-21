"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePasswordRequest = exports.validateLoginRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const loginValidationSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    navigatorObject: joi_1.default.any().required(),
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
const updatePasswordSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    user: joi_1.default.valid("student", "lecturer", "admin").required(),
});
const validateUpdatePasswordRequest = (req, res, next) => {
    const { error } = updatePasswordSchema.validate(req.body);
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
exports.validateUpdatePasswordRequest = validateUpdatePasswordRequest;
//# sourceMappingURL=default.js.map