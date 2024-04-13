import { Express, Request } from "express";
import multer from "multer";
import Cloudinary from "cloudinary";
import path from "path";
import fileSystem from "fs";
import { File } from "../models/File";
import { deleteFolderRecursive, generateRandomString } from "../Lib/Methods";
import { DefaultResponse } from "../Lib/Responses";

const basePath = "/file";
const CLOUDINARY_URL =
  "cloudinary://897745466481853:clC9-fOu0VrHXtKNEfYDggqSeUY@theajstars";

const cloudinary = Cloudinary.v2;
cloudinary.config({
  cloud_name: "theajstars",
  api_key: "897745466481853",
  api_secret: "clC9-fOu0VrHXtKNEfYDggqSeUY",
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/files");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
export default function (app: Express) {
  app.post(
    `${basePath}/upload`,
    upload.array("files", 10),
    async (req, res) => {
      const numberOfFiles = req?.files?.length as unknown as number;
      var files = [];
      for (var i = 0; i < numberOfFiles; i++) {
        const file = req?.files[i];
        const upload = await cloudinary.uploader.upload(file.path, {
          resource_type: "raw",
        });
        files = [
          ...files,
          {
            url: upload.url,
            fileName: upload.original_filename,
            cloudinaryID: upload.public_id,
          },
        ];
      }
      if (files.length === numberOfFiles) {
        console.log(files);
        const filesToUpload = files.map((f) => {
          return {
            id: generateRandomString(32),
            path: f.url,
            timestamp: Date.now(),
            cloudinaryID: f.fileName,
            name: f.fileName,
          };
        });
        const fs = await File.insertMany(filesToUpload);
        deleteFolderRecursive("./src/files");
        fileSystem.mkdirSync("./src/files");

        res.json({
          statusCode: 201,
          status: true,
          message: "File Uploaded!",
          data: fs,
        });
      } else {
        res.json(<DefaultResponse>{
          statusCode: 401,
          status: true,
          message: "An error occurred while uploading files",
          // err,
        });
      }
    }
  );
}
