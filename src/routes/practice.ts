import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
import { validateTokenRequest } from "../validation/course";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import {
  validateCreateLectureRequest,
  validateUpdatePracticeQuestionsRequest,
  validateDefaultLectureRequest,
  validateToggleLectureStatusRequest,
  validateUpdateLectureRequest,
} from "../validation/lecture";
import { Lecture } from "../models/Lecture";
import { generateRandomString } from "../Lib/Methods";
import { Practice } from "../models/Practice";
import { validateDefaultPracticeRequest } from "../validation/practice";
import { Attempt } from "../models/Attempt";
const basePath = "/practice";
export default function (app: Express) {
  // Get student attempts on a lecture practice
  app.post(
    `${basePath}/student/attempts`,
    validateDefaultPracticeRequest,
    async (req, res) => {
      const { token, studentID, practiceID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const attempts = await Attempt.find({
          studentID: studentID ?? id,
          practiceID,
        });
        res.json({
          statusCode: 200,
          status: true,
          data: attempts,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  // Get all lectures for a course
}
