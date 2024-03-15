import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
import { validateTokenSchema } from "../validation/course";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { Student } from "../models/Student";
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
  app.post(`${basePath}s/all`, validateTokenSchema, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user !== "student") {
      const lecturers = await Lecturer.find({}).select(
        "email firstName lastName id rank gender role serviceNumber"
      );
      res.json({
        status: true,
        statusCode: 200,
        data: lecturers,
        message: "Lecturers retrieved!",
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });

  app.post(
    `${basePath}/students/all`,
    validateTokenSchema,
    async (req, res) => {
      const { token } = req.body;
      const { user, id } = verifyToken(token);
      if (id && user && user === "lecturer") {
        const students = await Student.find({}).select(
          "id firstName lastName mail password serviceNumber rank gender role"
        );
        res.json(<DefaultResponse>{
          data: students,
          status: true,
          statusCode: 200,
          message: "Students found!",
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
