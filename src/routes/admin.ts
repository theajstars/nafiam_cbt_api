import { Express } from "express";
import bcrypt from "bcryptjs";
const basePath = "/admin";
export default function (app: Express) {
  app.post(`${basePath}/login`, async (req, res) => {
    // const { id, password } = req.body;
    res.json({
      status: true,
      data: req.body ?? "undefined",
    });
  });
}
bcrypt.genSalt(10).then(async (salt) => {
  const hash = await bcrypt.hash("somePass2024", salt);
  console.log(hash);
});
