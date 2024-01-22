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
const Admin_1 = require("../models/Admin");
const JWT_1 = require("../Lib/JWT");
const basePath = "/admin";
function default_1(app) {
    app.post(`${basePath}/login`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id, password } = req.body;
        const admin = yield Admin_1.Admin.findOne({ email: id });
        if (admin) {
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, admin.password);
            res.json({
                status: true,
                statusCode: isPasswordCorrect ? 200 : 401,
                admin: isPasswordCorrect ? admin : null,
                token: yield (0, JWT_1.createToken)(admin.id, "admin"),
            });
        }
        else {
            res.json({
                status: true,
                statusCode: 401,
            });
        }
    }));
    app.post(`${basePath}/verify_token`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const v = (0, JWT_1.verifyToken)(token);
        if (!v) {
            console.log("JWT Verification error!");
            res.json({
                status: false,
                statusCode: 401,
            });
        }
        else {
            console.log("Verified!", v);
            res.json({
                status: true,
                statusCode: 200,
                data: v,
                message: "Verified successfully!",
            });
        }
    }));
}
exports.default = default_1;
bcryptjs_1.default.genSalt(10).then((salt) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield bcryptjs_1.default.hash("somePass2024", salt);
    console.log(hash);
    //   const admin = new Admin({
    //     email: "atajiboyeo@gmail.com",
    //     password: hash,
    //     firstName: "Lord",
    //     lastName: "Braavo",
    //   });
    //   await admin.save();
}));
//# sourceMappingURL=admin.js.map