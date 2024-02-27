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
const basePath = "/file-upload";
function default_1(app) {
    app.post(`${basePath}`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const { id } = (0, JWT_1.verifyToken)(token);
        console.log(id, token, req.body);
    }));
}
exports.default = default_1;
//# sourceMappingURL=file.js.map