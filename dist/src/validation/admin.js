"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateLecturer = exports.validateCreateLecturer = exports.validateOnboardStudent = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const onboardstudentSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    rank: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    role: joi_1.default.string().required(),
    serviceNumber: joi_1.default.string().required(),
    // department: Joi.string().required(),
});
const validateOnboardStudent = (req, res, next) => {
    const { error } = onboardstudentSchema.validate(req.body);
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
exports.validateOnboardStudent = validateOnboardStudent;
const createLecturerSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    rank: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    role: joi_1.default.string().required(),
    serviceNumber: joi_1.default.string().required(),
    // department: Joi.string().required(),
});
const validateCreateLecturer = (req, res, next) => {
    const { error } = createLecturerSchema.validate(req.body);
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
exports.validateCreateLecturer = validateCreateLecturer;
const updateLecturerSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    lecturerID: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    rank: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    role: joi_1.default.string().required(),
    serviceNumber: joi_1.default.string().required(),
    // department: Joi.string().required(),
});
const validateUpdateLecturer = (req, res, next) => {
    const { error } = updateLecturerSchema.validate(req.body);
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
exports.validateUpdateLecturer = validateUpdateLecturer;
//# sourceMappingURL=admin.js.map