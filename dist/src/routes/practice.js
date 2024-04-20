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
const practice_1 = require("../validation/practice");
const Attempt_1 = require("../models/Attempt");
const basePath = "/practice";
function default_1(app) {
    // Get student attempts on a lecture practice
    app.post(`${basePath}/student/attempts`, practice_1.validateDefaultPracticeRequest, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token, studentID, practiceID } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const attempts = yield Attempt_1.Attempt.find({
                studentID: studentID !== null && studentID !== void 0 ? studentID : id,
                practiceID,
            });
            res.json({
                statusCode: 200,
                status: true,
                data: attempts,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
    // Get all lectures for a course
}
exports.default = default_1;
//# sourceMappingURL=practice.js.map