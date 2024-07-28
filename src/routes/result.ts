import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Instructor } from "../models/Instructor";
import { validateTokenRequest } from "../validation/course";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { Student } from "../models/Student";
import { Result } from "../models/Results";
import {
  validateGetSingleResultRequest,
  validateGetAllStudentinResultsRequest,
  validateGetOneStudentAllResultRequest,
} from "../validation/student";
import { Attendance } from "../models/Attendance";
const basePath = "/result";
export default function (app: Express) {
  // Get One student Result for One Examination
  app.post(
    `${basePath}/student/get`,
    validateGetSingleResultRequest,
    async (req, res) => {
      const { token, batchID, studentID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const result = await Result.findOne({
          batchID,
          studentID: studentID ?? id,
        });
        console.log(batchID, studentID, result);
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
  // Get All Results all at once
  app.post(`${basePath}s/all`, validateTokenRequest, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user !== "student") {
      const results = await Result.find();
      res.json({
        status: true,
        statusCode: 200,
        message: "Results found!",
        data: results,
      });
    }
  });

  // Get All Examination Attendances
  app.post(
    `${basePath}s/attendances/all`,
    validateTokenRequest,
    async (req, res) => {
      const { token } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user !== "student") {
        const attendances = await Attendance.find();
        res.json({
          status: true,
          statusCode: 200,
          message: "Attendances found!",
          data: attendances,
        });
      }
    }
  );
}
