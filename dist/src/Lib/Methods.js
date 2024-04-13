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
exports.deleteFolderRecursive = exports.removeEmptyFields = exports.returnUnlessUndefined = exports.genPassword = exports.generateRandomString = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs_1 = __importDefault(require("fs"));
const generateRandomString = (length, charset = "ALL") => {
    let result = "";
    const characters = charset === "ALL"
        ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
};
exports.generateRandomString = generateRandomString;
const genPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const salt = yield bcryptjs_1.default.genSalt(saltRounds);
    const hash = yield bcryptjs_1.default.hash(password, salt);
    console.log("Thine Hash", hash);
    return hash;
});
exports.genPassword = genPassword;
const returnUnlessUndefined = (param) => {
    return param && param.length > 0 ? param : undefined;
};
exports.returnUnlessUndefined = returnUnlessUndefined;
const removeEmptyFields = (obj) => {
    for (let key in obj) {
        if (obj[key] === "" || obj[key] === undefined) {
            delete obj[key];
        }
    }
    return obj;
};
exports.removeEmptyFields = removeEmptyFields;
const deleteFolderRecursive = (path) => {
    if (fs_1.default.existsSync(path)) {
        fs_1.default.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs_1.default.lstatSync(curPath).isDirectory()) {
                // recurse
                (0, exports.deleteFolderRecursive)(curPath);
            }
            else {
                // delete file
                fs_1.default.unlinkSync(curPath);
            }
        });
        fs_1.default.rmdirSync(path);
    }
};
exports.deleteFolderRecursive = deleteFolderRecursive;
//# sourceMappingURL=Methods.js.map