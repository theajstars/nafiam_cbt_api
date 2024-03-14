import { Express } from "express";
import bcrypt from "bcryptjs";
import ws from "ws";
import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
import { Examination } from "../models/Examination";
import {
  UnauthorizedResponseObject,
  returnSuccessResponseObject,
} from "../Lib/Misc";
import { generateRandomString } from "../Lib/Methods";
import { validateTokenSchema } from "../validation/course";
import {
  validateApproveExaminationRequest,
  validateCreateExaminationSchema,
  validateDefaultExaminationRequest,
  validateEditExaminationRequest,
} from "../validation/examination";
import { Course } from "../models/Course";
const basePath = "/examination";
export default function (app: Express) {
  app.post(
    `${basePath}/create`,
    validateCreateExaminationSchema,
    async (req, res) => {
      const { token, title, year, course: courseCode } = req.body;
      const { id } = verifyToken(token);
      const lecturer = await Lecturer.findOne({ id });
      if (token && lecturer) {
        const course = await Course.findOne({ code: courseCode });
        const examination = await new Examination({
          id: generateRandomString(16),
          title,
          year,
          lecturerID: id,
          course: course.id,
          approved: false,
          completed: false,
          published: false,
          started: false,
          password: "",
          students: [],
        }).save();
        res.json(
          returnSuccessResponseObject("Examination created!", 201, examination)
        );
      } else {
        res.json({
          status: true,
          statusCode: 401,
          message: "Unauthorized",
        });
      }
    }
  );
  app.post(
    `${basePath}s/all`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, isAdmin } = req.body;
      const { id, user } = verifyToken(token);
      if (token && id) {
        if (isAdmin && user !== "admin") {
          res.json(UnauthorizedResponseObject);
        } else {
          const examinations =
            isAdmin && user === "admin"
              ? await Examination.find({})
              : await Examination.find({ lecturerID: id });
          res.json(
            returnSuccessResponseObject(
              "Examination list obtained!",
              200,
              examinations
            )
          );
        }
      }
    }
  );
  app.post(
    `${basePath}/get`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, examinationID } = req.body;
      const { id, user } = verifyToken(token);

      if (id && user) {
        const examination =
          user === "admin"
            ? await Examination.findOne({ id: examinationID })
            : await Examination.findOne({ id: examinationID, lecturerID: id });

        console.log(examination, user, id);
        res.json(
          returnSuccessResponseObject(
            examination === null ? "Not Found!" : "Examination found!",
            examination === null ? 404 : 200,
            examination
          )
        );
      } else {
        res.json({
          status: true,
          statusCode: 401,
          message: "Unauthorized",
        });
      }
    }
  );
  app.delete(
    `${basePath}/delete`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, examinationID } = req.body;
      const { id, user } = verifyToken(token);

      if (id && user && user !== "student") {
        const examination = await Examination.findOneAndDelete({
          id: examinationID,
        });
        res.json(
          returnSuccessResponseObject(
            examination === null
              ? "Not Found!"
              : "Examination deleted successfully!",
            examination === null ? 404 : 200,
            examination
          )
        );
      } else {
        res.json({
          status: true,
          statusCode: 401,
          message: "Unauthorized",
        });
      }
    }
  );
  app.post(
    `${basePath}/edit`,
    validateEditExaminationRequest,
    async (req, res) => {
      const { token, examinationID, questions, title, year, course } = req.body;
      const { id } = verifyToken(token);
      const lecturer = await Lecturer.findOne({ id });
      if (token && lecturer) {
        const examination = await Examination.findOneAndUpdate(
          { id: examinationID },
          { questions, title, year, course }
        );
        res.json(
          returnSuccessResponseObject(
            examination === null ? "Not Found!" : "Examination updated!",
            examination === null ? 404 : 201,
            examination
          )
        );
      } else {
        res.json({
          status: true,
          statusCode: 401,
          message: "Unauthorized",
        });
      }
    }
  );
  app.post(
    `${basePath}/publish`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, examinationID } = req.body;
      const { id, user } = verifyToken(token);
      const lecturer = await Lecturer.findOne({ id });
      if (id && user === "lecturer" && lecturer) {
        const examination = await Examination.findOneAndUpdate(
          { id: examinationID },
          { published: true }
        );
        res.json(
          returnSuccessResponseObject(
            examination === null ? "Not Found!" : "Examination published!",
            examination === null ? 404 : 200,
            examination
          )
        );
      } else {
        res.json({
          status: true,
          statusCode: 401,
          message: "Unauthorized",
        });
      }
    }
  );
  app.post(
    `${basePath}/approve`,
    validateApproveExaminationRequest,
    async (req, res) => {
      const { token, examinationID, isAdmin, questions } = req.body;
      const { id, user } = verifyToken(token);
      if (!isAdmin || !id || !user || user !== "admin") {
        res.json(UnauthorizedResponseObject);
      } else {
        const examination = await Examination.findOneAndUpdate(
          {
            id: examinationID,
          },
          { approved: true, selectedQuestions: questions }
        );
        res.json(
          returnSuccessResponseObject(
            examination === null ? "Not Found!" : "Examination published!",
            examination === null ? 404 : 200,
            examination
          )
        );
      }
    }
  );
  app.post(
    `${basePath}/start`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, examinationID, isAdmin } = req.body;
      const { id, user } = verifyToken(token);
      if (!isAdmin || !id || !user || user !== "admin") {
        res.json(UnauthorizedResponseObject);
      } else {
        const password = generateRandomString(6, "ALPHABET").toUpperCase();
        const examination = await Examination.findOneAndUpdate(
          {
            id: examinationID,
          },
          { started: true, password }
        );
        res.json({
          statusCode: 200,
          status: true,
          message: "Examination starting",
          data: { password },
        });
      }
    }
  );
  app.post(
    `${basePath}/timer/start`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, examinationID, isAdmin } = req.body;
      const { id, user } = verifyToken(token);
      if (!isAdmin || !id || !user || user !== "admin") {
        res.json(UnauthorizedResponseObject);
      } else {
        const examination = await Examination.findOneAndUpdate(
          {
            id: examinationID,
          },
          { password: "" }
        );
        res.json(
          returnSuccessResponseObject(
            examination === null ? "Not Found!" : "Examination timer started!",
            examination === null ? 404 : 200,
            examination
          )
        );
      }
    }
  );
  app.post(
    `${basePath}/students/get`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, examinationID, isAdmin } = req.body;
      const { id, user } = verifyToken(token);
      if (!isAdmin || !id || !user || user !== "admin") {
        res.json(UnauthorizedResponseObject);
      } else {
        const examination = await Examination.findOne({
          id: examinationID,
        });
        const course = await Course.findOne({ id: examination.course });
        const { students } = course;
        res.json({
          statusCode: 200,
          status: true,
          message: "Students found!",
          data: students,
        });
      }
    }
  );
}
