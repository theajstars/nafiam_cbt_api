import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Types";

import { Lecturer } from "../models/Lecturer";
const basePath = "/lecturer";
export default function (app: Express) {
  app.post(`${basePath}/login`, async (req, res) => {
    const { id, password } = req.body;
    const lecturer = await Lecturer.findOne({ email: id });
    if (lecturer) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        lecturer.password
      );
      res.json({
        status: true,
        statusCode: isPasswordCorrect ? 200 : 401,
        admin: isPasswordCorrect ? lecturer : null,
        token: await (lecturer.id, "lecturer"),
      });
    } else {
      res.json({
        status: true,
        statusCode: 401,
        message: "Invalid email and password",
      });
    }
  });
}
