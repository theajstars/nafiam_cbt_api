import { Express, Request } from "express";
import multer from "multer";
import fileUrl from "file-url";
import url from "url";
import { File } from "../models/File";
import { generateRandomString } from "../Lib/Methods";

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

    const file = await new File({
      id: generateRandomString(32),
      path: req.file.path,
      name: req.file.filename,
      timestamp: Date.now(),
    }).save();
    res.json({
      token,
      data: {
        file,
        sack: url.fileURLToPath(url.pathToFileURL(req.file.path)),
      },
    });
  });
  app.get(`${basePath}s/:file`, async (req, res) => {
    console.log(req.params.file);
  });
}
