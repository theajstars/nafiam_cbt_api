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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const basePath = "/admin";
function default_1(app) {
    app.post(`${basePath}/login`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        // const { id, password } = req.body;
        res.json({
            status: true,
            data: (_a = req.body) !== null && _a !== void 0 ? _a : "undefined",
        });
    }));
}
exports.default = default_1;
bcryptjs_1.default.genSalt(10).then((salt) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield bcryptjs_1.default.hash("somePass2024", salt);
    console.log(hash);
}));
//# sourceMappingURL=admin.js.map