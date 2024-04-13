import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
import { validateTokenSchema } from "../validation/course";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { Student } from "../models/Student";
import { validateDefaultLecturerRequest } from "../validation/lecturer";
import { validateDefaultProfileUpdateRequest } from "../validation/default";
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
        message: isPasswordCorrect ? "Logged In!" : "Incorrect Password",
        token: isPasswordCorrect
          ? await createToken(lecturer.id, "lecturer")
          : null,
      });
    } else {
      res.json({
        status: true,
        statusCode: 401,
        message: "Account not found",
      });
    }
  });
  app.post(
    `${basePath}/profile/get`,
    validateDefaultLecturerRequest,
    async (req, res) => {
      const { token, lecturerID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const lecturer = await Lecturer.findOne({ id: lecturerID ?? id });
        res.json({
          status: true,
          statusCode: 200,
          message: "Lecturer found!",
          data: lecturer,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/profile/update`,
    validateDefaultProfileUpdateRequest,
    async (req, res) => {
      const { token, firstName, lastName, email } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "lecturer") {
        const lecturer = await Lecturer.findOneAndUpdate(
          { id },
          { firstName, lastName, email }
        );
        res.json({
          status: true,
          statusCode: 200,
          data: lecturer,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(`${basePath}s/all`, validateTokenSchema, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user !== "student") {
      const lecturers = await Lecturer.find({}).select(
        "email firstName lastName id rank gender role serviceNumber  dateCreated isChangedPassword"
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
          "id firstName lastName email password serviceNumber rank gender role"
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
