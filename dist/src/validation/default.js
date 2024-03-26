"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDefaultFindUserRequest = exports.validateDefaultProfileUpdateRequest = exports.validateUpdatePasswordRequest = exports.validateLoginRequest = void 0;
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
    oldPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().required(),
    navigatorObject: joi_1.default.any().required(),
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
const updateProfileSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
});
const validateDefaultProfileUpdateRequest = (req, res, next) => {
    const { error } = updateProfileSchema.validate(req.body);
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
exports.validateDefaultProfileUpdateRequest = validateDefaultProfileUpdateRequest;
const findUserSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    userCase: joi_1.default.string().required(),
    searchString: joi_1.default.string().optional().allow(""),
    rank: joi_1.default.string().optional().allow(""),
    gender: joi_1.default.string().optional().allow(""),
});
const validateDefaultFindUserRequest = (req, res, next) => {
    const { error } = findUserSchema.validate(req.body);
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
exports.validateDefaultFindUserRequest = validateDefaultFindUserRequest;
//# sourceMappingURL=default.js.map