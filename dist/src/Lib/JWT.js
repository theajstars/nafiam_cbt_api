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
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (token) => {
    const isValid = jsonwebtoken_1.default.verify(token, "AJD9W38(#*f(n#h9FAh#(!#bn", (err, decoded) => {
        if (err) {
            return { error: true };
        }
        else {
            return decoded;
        }
    });
    return isValid;
};
exports.verifyToken = verifyToken;
const createToken = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({ id: id, user }, "AJD9W38(#*f(n#h9FAh#(!#bn", {
        expiresIn: "7d",
    });
    return token;
});
exports.createToken = createToken;
//# sourceMappingURL=JWT.js.map