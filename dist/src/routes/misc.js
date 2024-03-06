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
const course_1 = require("../validation/course");
const basePath = "/misc";
function default_1(app) {
    app.post(`${basePath}/ranks/get`, course_1.validateTokenSchema, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id, user } = (0, JWT_1.verifyToken)(token);
        if (id && user) {
            const nigerianAirForceRanks = [
                "Marshal of the Nigerian Air Force",
                "Air Chief Marshal",
                "Air Marshal",
                "Air Vice Marshal",
                "Air Commodore",
                "Group Captain",
                "Wing Commander",
                "Squadron Leader",
                "Flight Lieutenant",
                "Flying Officer",
                "Pilot Officer",
                "Air Warrant Officer",
                "Master Warrant Officer",
                "Warrant Officer",
                "Flight Sergeant",
                "Sergeant",
                "Corporal",
                "Lance Corporal",
            ];
            res.json({
                status: true,
                statusCode: 200,
                message: "List of ranks",
                data: nigerianAirForceRanks,
            });
        }
        else {
            res.json(Misc_1.UnauthorizedResponseObject);
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=misc.js.map