import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
import { validateTokenSchema } from "../validation/course";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { Student } from "../models/Student";
import { Result } from "../models/Results";
import { validateGetSingleResultRequest } from "../validation/student";
const basePath = "/result";
export default function (app: Express) {
  app.post(
    `${basePath}/get`,
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
  app.post(`${basePath}s/get`, validateTokenSchema, async (req, res) => {
    const { token, examinationID } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user !== "student") {
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
  });
}
