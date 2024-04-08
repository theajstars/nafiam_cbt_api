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
import { validateCreateLectureRequest } from "../validation/lecture";
import { Lecture } from "../models/Lecture";
import { generateRandomString } from "../Lib/Methods";
const basePath = "/lecture";
export default function (app: Express) {
  app.post(
    `${basePath}/create`,
    validateCreateLectureRequest,
    async (req, res) => {
      const { title, courseID, description, files, token } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "lecturer") {
        const lecture = await new Lecture({
          id: generateRandomString(32),
          title,
          courseID,
          description,
          files,
        }).save();
        res.json({
          statusCode: 201,
          message: "Lecture has been added!",
          status: true,
          data: lecture,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
