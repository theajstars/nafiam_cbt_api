import { Express } from "express";
import bcrypt from "bcryptjs";
import {
  validateDefaultFindUserRequest,
  validateDefaultProfileUpdateRequest,
  validateLoginRequest,
} from "../validation/default";
import { validateTokenRequest } from "../validation/course";
import { createToken, verifyToken } from "../Lib/JWT";
import { Student } from "../models/Student";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { Log } from "../models/Log";
import { genPassword, generateRandomString } from "../Lib/Methods";

import { Lecturer } from "../models/Lecturer";
import { Admin } from "../models/Admin";

const basePath = "/student";
export default function (app: Express) {
  app.post(`${basePath}/login`, validateLoginRequest, async (req, res) => {
    const { id, password, navigatorObject } = req.body;
    const student = await Student.findOne({ serviceNumber: id.toUpperCase() });
    if (student) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        student.password
      );
      const log = await new Log({
        personnelID: student.id,
        id: generateRandomString(32),
        userType: "student",
        action: "login",
        navigatorObject: navigatorObject,
        comments: isPasswordCorrect ? "Login successful!" : "Invalid Password",
        timestamp: Date.now(),
      }).save();
      res.json({
        status: true,
        statusCode: isPasswordCorrect ? 200 : 401,
        message: "Incorrect password",
        student: isPasswordCorrect ? student : null,
        token: isPasswordCorrect
          ? await createToken(student.id, "student")
          : null,
        log: log.action,
      });
    } else {
      res.json({
        status: true,
        message: "Student not found",
        statusCode: 401,
      });
    }
  });
  app.post(
    `${basePath}/profile/get`,
    validateTokenRequest,
    async (req, res) => {
      const { token } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "student") {
        const student = await Student.findOne({ id }).select(
          "id firstName lastName email rank serviceNumber gender role isChangedPassword"
        );
        res.json({
          status: true,
          statusCode: 200,
          data: student,
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
      if (id && user && user === "student") {
        const student = await Student.findOneAndUpdate(
          { id },
          { firstName, lastName, email }
        );
        res.json({
          status: true,
          statusCode: 200,
          data: student,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
