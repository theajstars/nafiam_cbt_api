import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
import { validateTokenSchema } from "../validation/course";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { Student } from "../models/Student";
import { Result } from "../models/Results";
import {
  validateGetSingleResultRequest,
  validateGetAllStudentinResultsRequest,
  validateGetOneStudentAllResultRequest,
} from "../validation/student";
const basePath = "/result";
export default function (app: Express) {
  // Get One student Results for One Examination
  app.post(
    `${basePath}/student/get`,
    validateGetSingleResultRequest,
    async (req, res) => {
      const { token, examinationID, studentID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const result = await Result.findOne({
          examinationID,
          studentID: user === "student" ? id : studentID,
        });
        res.json({
          status: true,
          statusCode: 200,
          message: "Result found!",
          data: result,
        });
      }
    }
  );
  // Get All Student Results for One examination
  app.post(
    `${basePath}s/students/get`,
    validateGetSingleResultRequest,
    async (req, res) => {
      const { token, examinationID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const results = await Result.find({
          examinationID,
        });
        res.json({
          status: true,
          statusCode: 200,
          message: "Results found!",
          data: results,
        });
      }
    }
  );
  // Get One Student Result for ALL examination
  app.post(
    `${basePath}s/student/all`,
    validateGetOneStudentAllResultRequest,
    async (req, res) => {
      const { token, studentID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const results = await Result.find({
          studentID: user === "student" ? id : studentID,
        });
        res.json({
          status: true,
          statusCode: 200,
          message: "Results found!",
          data: results,
        });
      }
    }
  );
}
