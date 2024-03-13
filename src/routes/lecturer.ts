import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
const basePath = "/lecturer";
export default function (app: Express) {
  app.post(`${basePath}/login`, async (req, res) => {
    const { id, password } = req.body;
    console.log({ id, password });
    const lecturer = await Lecturer.findOne({
      serviceNumber: id.toUpperCase(),
    });
    if (lecturer) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        lecturer.password
      );

      res.json({
        status: true,
        statusCode: isPasswordCorrect ? 200 : 401,
        message: "Logged In!",
        token: await createToken(lecturer.id, "lecturer"),
      });
    } else {
      res.json({
        status: true,
        statusCode: 401,
        message: "Account not found",
      });
    }
  });
}
