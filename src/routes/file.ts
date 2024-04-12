import { Express, Request } from "express";
import multer from "multer";
import Cloudinary from "cloudinary";
import url from "url";
import { File } from "../models/File";
import { generateRandomString } from "../Lib/Methods";
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
  destination: (req, file, callback) => {
    callback(null, "./src/files");
  },
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });
export default function (app: Express) {
  app.post(
    `${basePath}/upload-one`,
    upload.single("file"),
    async (req, res) => {
      cloudinary.uploader.upload(
        req.file.path,
        { resource_type: "raw" },
        async (err, result) => {
          if (err) {
            res.json(<DefaultResponse>{
              statusCode: 401,
              status: true,
              message: "An error occurred while uploading files",
              err,
            });
          } else {
            const file = await new File({
              id: generateRandomString(32),
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
        }
      );
    }
  );

  app.get(`${basePath}s/:file`, async (req, res) => {
    console.log(req.params.file);
  });
}
