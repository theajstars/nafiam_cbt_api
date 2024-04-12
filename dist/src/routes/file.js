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
const cloudinary_1 = __importDefault(require("cloudinary"));
const File_1 = require("../models/File");
const Methods_1 = require("../Lib/Methods");
const basePath = "/file";
const CLOUDINARY_URL = "cloudinary://897745466481853:clC9-fOu0VrHXtKNEfYDggqSeUY@theajstars";
const cloudinary = cloudinary_1.default.v2;
cloudinary.config({
    cloud_name: "theajstars",
    api_key: "897745466481853",
    api_secret: "clC9-fOu0VrHXtKNEfYDggqSeUY",
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/files");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
function default_1(app) {
    app.post(`${basePath}/upload-one`, upload.single("file"), (req, res) => __awaiter(this, void 0, void 0, function* () {
        cloudinary.uploader.upload(req.file.path, { resource_type: "raw" }, (err, result) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.json({
                    statusCode: 401,
                    status: true,
                    message: "An error occurred while uploading files",
                    err,
                });
            }
            else {
                const file = yield new File_1.File({
                    id: (0, Methods_1.generateRandomString)(32),
                    path: result.url,
                    timestamp: Date.now(),
                    name: result.original_filename,
                }).save();
                res.json({
                    statusCode: 201,
                    status: true,
                    message: "File Uploaded!",
                    file,
                });
            }
        }));
    }));
    app.post(`${basePath}/upload-many`, upload.array("files", 10), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const numberOfFiles = req.files.length;
        var files = [];
        for (var i = 0; i < numberOfFiles; i++) {
            const file = req.files[i];
            const upload = yield cloudinary.uploader.upload(file.path, {
                resource_type: "raw",
            });
            files = [
                ...files,
                {
                    url: upload.url,
                    fileName: upload.original_filename,
                },
            ];
        }
        if (files.length === numberOfFiles) {
            console.log(files);
            const filesToUpload = files.map((f) => {
                return {
                    id: (0, Methods_1.generateRandomString)(32),
                    path: f.url,
                    timestamp: Date.now(),
                    name: f.fileName,
                };
            });
            const fs = yield File_1.File.insertMany(filesToUpload);
            res.json({
                statusCode: 201,
                status: true,
                message: "File Uploaded!",
                files: fs,
            });
        }
        else {
            res.json({
                statusCode: 401,
                status: true,
                message: "An error occurred while uploading files",
                // err,
            });
        }
    }));
}
exports.default = default_1;
//# sourceMappingURL=file.js.map