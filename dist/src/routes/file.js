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
const url_1 = __importDefault(require("url"));
const File_1 = require("../models/File");
const Methods_1 = require("../Lib/Methods");
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
        const file = yield new File_1.File({
            id: (0, Methods_1.generateRandomString)(32),
            path: req.file.path,
            name: req.file.filename,
            timestamp: Date.now(),
        }).save();
        res.json({
            token,
            data: {
                file,
                sack: url_1.default.fileURLToPath(url_1.default.pathToFileURL(req.file.path)),
            },
        });
    }));
    app.get(`${basePath}s/:file`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        console.log(req.params.file);
    }));
}
exports.default = default_1;
//# sourceMappingURL=file.js.map