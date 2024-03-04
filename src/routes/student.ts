import { Express } from "express";
import bcrypt from "bcryptjs";
import { validateLoginRequest } from "../validation/default";
import { validateTokenSchema } from "../validation/course";
import { createToken, verifyToken } from "../Lib/JWT";
import { Student } from "../models/Student";
import { UnauthorizedResponseObject } from "../Lib/Misc";

const basePath = "/student";
export default function (app: Express) {
  app.post(`${basePath}/login`, validateLoginRequest, async (req, res) => {
    const { id, password } = req.body;
    const student = await Student.findOne({ email: id });
    if (student) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        student.password
      );
      res.json({
        status: true,
        statusCode: isPasswordCorrect ? 200 : 401,
        student: isPasswordCorrect ? student : null,
        token: await createToken(student.id, "student"),
      });
    } else {
      res.json({
        status: true,
        statusCode: 401,
      });
    }
  });
  app.post(`${basePath}/profile/get`, validateTokenSchema, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user === "student") {
      const student = await Student.findOne({ id }).select(
        "firstName lastName email"
      );
      res.json({
        status: true,
        statusCode: 200,
        data: student,
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });
}
