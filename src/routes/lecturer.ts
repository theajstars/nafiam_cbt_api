import { Express } from "express";

const basePath = "/lecturer";
export default function (app: Express) {
  app.post(`${basePath}/login`, async (req, res) => {
    const { id, password } = req.body;
    res.json({
      status: true,
      data: req.body ?? "undefined",
    });
  });
}
