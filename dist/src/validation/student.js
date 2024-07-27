"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetOneStudentAllResultRequest = exports.validateGetAllStudentinResultsRequest = exports.validateGetSingleResultRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const getSingleResultSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().optional(),
    batchID: joi_1.default.string().optional(),
    studentID: joi_1.default.string().optional(),
    resultID: joi_1.default.string().optional(),
});
const validateGetSingleResultRequest = (req, res, next) => {
    const { error } = getSingleResultSchema.validate(req.body);
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
exports.validateGetSingleResultRequest = validateGetSingleResultRequest;
const getAllStudentResultsSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    examinationID: joi_1.default.string().required(),
    studentID: joi_1.default.string().optional(),
});
const validateGetAllStudentinResultsRequest = (req, res, next) => {
    const { error } = getAllStudentResultsSchema.validate(req.body);
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
exports.validateGetAllStudentinResultsRequest = validateGetAllStudentinResultsRequest;
const getOneStudentAllResultSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    studentID: joi_1.default.string().optional(),
});
const validateGetOneStudentAllResultRequest = (req, res, next) => {
    const { error } = getOneStudentAllResultSchema.validate(req.body);
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
exports.validateGetOneStudentAllResultRequest = validateGetOneStudentAllResultRequest;
//# sourceMappingURL=student.js.map