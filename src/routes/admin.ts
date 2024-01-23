import { Express, Request } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin";
import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Types";
import { OnboardStudentRequest } from "../Lib/Request";
import { UnauthorizedResponseObject } from "../Lib/Misc";
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
      res.json(UnauthorizedResponseObject);
    } else {
      res.json(<DefaultResponse>{
        status: true,
        statusCode: 200,
        data: v,
        message: "Verified successfully!",
      });
    }
  });

  app.post("/admin/onboard_student", async (req, res) => {
    const body: OnboardStudentRequest = req.body;
    if (!body || !body.token) {
      res.json(UnauthorizedResponseObject);
    }
  });
}
