"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("../models/Log");
const log_1 = require("../validation/log");
const basePath = "/misc";
function default_1(app) {
    app.get("/", (req, res) => {
        res.json({
            status: "true",
            statusCode: 200,
            message: "Server is live!!",
        });
    });
    app.post(`${basePath}/all`, log_1.validateGetAllLogsRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { timestamp, personnelID, action, page, limit } = req.body;
        const totalCount = yield Log_1.Log.countDocuments({
            personnelID,
            action,
            timestamp,
        });
        const logs = yield Log_1.Log.find({
            personnelID,
            action,
            // timestamp,
        }, {}, { skip: page === 1 ? 0 : page === 2 ? limit : (page - 1) * limit, limit });
        res.json({
            status: true,
            statusCode: 200,
            data: logs,
            page,
            limit,
            rows: logs.length,
            totalCount,
        });
    }));
}
exports.default = default_1;
//# sourceMappingURL=log.js.map