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
const JWT_1 = require("../Lib/JWT");
const Misc_1 = require("../Lib/Misc");
const Methods_1 = require("../Lib/Methods");
const Log_1 = require("../models/Log");
const log_1 = require("../validation/log");
const basePath = "/logs";
function default_1(app) {
    app.post(`${basePath}/all`, log_1.validateGetAllLogsRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, timestamp, personnelID, action, userType, page, limit } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user && user === "admin") {
            const filter = {
                action,
                userType,
            };
            console.log((0, Methods_1.removeEmptyFields)(filter));
            const logs = yield Log_1.Log.find(Object.assign({}, (0, Methods_1.removeEmptyFields)(filter)), {}, {
                skip: page === 1 ? 0 : page === 2 ? limit : (page - 1) * limit,
                limit,
            });
            const totalCount = yield Log_1.Log.countDocuments({});
            res.json({
                status: true,
                statusCode: 200,
                data: logs,
                page,
                limit,
                rows: logs.length,
                total: totalCount,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=log.js.map