import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Instructor } from "../models/Instructor";
import { validateTokenRequest } from "../validation/course";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { Student } from "../models/Student";
import { validateDefaultInstructorRequest } from "../validation/instructor";
import { validateDefaultProfileUpdateRequest } from "../validation/default";
import { generateRandomString } from "../Lib/Methods";
import { Log } from "../models/Log";
const basePath = "/instructor";
export default function (app: Express) {
  app.post(`${basePath}/login`, async (req, res) => {
    const { id, password } = req.body;

    const instructor = await Instructor.findOne({
      $or: [{ serviceNumber: id.toUpperCase() }, { email: id }],
    });
    if (instructor) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        instructor.password
      );

      const log = await new Log({
        personnelID: instructor.id,
        id: generateRandomString(32),
        userType: "instructor",
        action: "login",
        comments: isPasswordCorrect ? "Login successful!" : "Invalid Password",
        timestamp: Date.now(),
        status: isPasswordCorrect ? "success" : "error",
      }).save();
      res.json({
        status: true,
        statusCode: isPasswordCorrect ? 200 : 401,
        message: isPasswordCorrect ? "Logged In!" : "Incorrect Password",
        token: isPasswordCorrect
          ? await createToken(instructor.id, "instructor")
          : null,
        log,
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
    validateDefaultInstructorRequest,
    async (req, res) => {
      const { token, instructorID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "instructor") {
        const instructor = await Instructor.findOne({ id: instructorID ?? id });
        res.json({
          status: true,
          statusCode: 200,
          message: "Instructor found!",
          data: instructor,
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
      if (id && user && user === "instructor") {
        const instructor = await Instructor.findOneAndUpdate(
          { id },
          { firstName, lastName, email }
        );
        res.json({
          status: true,
          statusCode: 200,
          data: instructor,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(`${basePath}s/all`, validateTokenRequest, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user !== "student") {
      const instructors = await Instructor.find({}).select(
        "email firstName lastName id rank gender role serviceNumber  dateCreated isChangedPassword school"
      );
      res.json({
        status: true,
        statusCode: 200,
        data: instructors,
        message: "Instructors retrieved!",
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });

  app.post(
    `${basePath}/students/all`,
    validateTokenRequest,
    async (req, res) => {
      const { token } = req.body;
      const { user, id } = verifyToken(token);
      if (id && user && user === "instructor") {
        const students = await Student.find({}).select(
          "id firstName lastName email password serviceNumber rank gender role school"
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
