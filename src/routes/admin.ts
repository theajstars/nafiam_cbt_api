import { Express } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin";
import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Types";
const basePath = "/admin";

export default function (app: Express) {
  app.post(`${basePath}/login`, async (req, res) => {
    const { id, password } = req.body;
    const admin = await Admin.findOne({ email: id });
    if (admin) {
      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      res.json({
        status: true,
        statusCode: isPasswordCorrect ? 200 : 401,
        admin: isPasswordCorrect ? admin : null,
        token: await createToken(admin.id, "admin"),
      });
    } else {
      res.json({
        status: true,
        statusCode: 401,
      });
    }
  });
  app.post(`${basePath}/verify_token`, async (req, res) => {
    const { token } = req.body;
    const v = verifyToken(token);
    if (!v) {
      console.log("JWT Verification error!");
      res.json({
        status: false,
        statusCode: 401,
      });
    } else {
      console.log("Verified!", v);
      res.json(<DefaultResponse>{
        status: true,
        statusCode: 200,
        data: v,
        message: "Verified successfully!",
      });
    }
  });
}
bcrypt.genSalt(10).then(async (salt) => {
  const hash = await bcrypt.hash("somePass2024", salt);
  console.log(hash);
  //   const admin = new Admin({
  //     email: "atajiboyeo@gmail.com",
  //     password: hash,
  //     firstName: "Lord",
  //     lastName: "Braavo",
  //   });
  //   await admin.save();
});
