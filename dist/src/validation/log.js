"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetAllLogsRequest = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const getAllLogsSchema = joi_1.default.object({
    timestamp: joi_1.default.number().optional(),
    personnelID: joi_1.default.string().optional(),
    page: joi_1.default.string().optional(),
    limit: joi_1.default.string().optional(),
    type: joi_1.default.string().optional(),
});
const validateGetAllLogsRequest = (req, res, next) => {
    const { error } = getAllLogsSchema.validate(req.body);
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
exports.validateGetAllLogsRequest = validateGetAllLogsRequest;
//# sourceMappingURL=log.js.map