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
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const basePath = "/file";
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./src/files");
    },
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
function default_1(app) {
    app.post(`${basePath}/upload`, upload.single("file"), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        res.json({
            token,
            body: req.file,
        });
    }));
    app.get(`${basePath}s/:file`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        console.log(req.params.file);
        fs_1.default.readFile(`./src/files/${req.params.file}`, (err, file) => {
            if (err) {
                res.json({
                    error: err,
                });
            }
            else {
                res.json({
                    file,
                });
            }
        });
    }));
}
exports.default = default_1;
//# sourceMappingURL=file.js.map