import { Express, Request } from "express";
import multer from "multer";
import Fs from "fs";

const basePath = "/file";
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
  app.post(`${basePath}/upload`, upload.single("file"), async (req, res) => {
    const { token } = req.body;

    res.json({
      token,
      body: req.file,
    });
  });
  app.get(`${basePath}s/:file`, async (req, res) => {
    console.log(req.params.file);
    Fs.readFile(`./src/files/${req.params.file}`, (err, file) => {
      if (err) {
        res.json({
          error: err,
        });
      } else {
        res.json({
          file,
        });
      }
    });
  });
}
