import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
import { validateTokenSchema } from "../validation/course";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import {
  validateCreateLectureRequest,
  validateCreatePracticeQuestionsRequest,
  validateDefaultLectureRequest,
} from "../validation/lecture";
import { Lecture } from "../models/Lecture";
import { generateRandomString } from "../Lib/Methods";
import { Practice } from "../models/Practice";
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
          description,
          courseID,
          dateCreated: Date.now(),
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
  app.post(
    `${basePath}s/all`,
    validateDefaultLectureRequest,
    async (req, res) => {
      const { token, courseID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const lectures = await Lecture.find({ courseID });
        res.json({
          statusCode: 200,
          message: "Lectures found!",
          status: true,
          data: lectures,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/get/:lectureID`,
    validateDefaultLectureRequest,
    async (req, res) => {
      const { token } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const lecture = await Lecture.findOne({ id: req.params.lectureID });
        res.json({
          statusCode: 200,
          message: "Lecture found!",
          status: true,
          data: lecture,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.delete(
    `${basePath}/delete`,
    validateDefaultLectureRequest,
    async (req, res) => {
      const { token, lectureID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "lecturer") {
        const lecture = await Lecture.findOneAndDelete({ id: lectureID });
        res.json({
          statusCode: 204,
          message: "Lecture has been deleted!",
          status: true,
          data: lecture,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/practice/create`,
    validateCreatePracticeQuestionsRequest,
    async (req, res) => {
      const { token, lectureID, questions } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "lecturer") {
        const practice = await new Practice({
          id: generateRandomString(32),
          lectureID,
          questions,
          dateCreated: Date.now(),
          active: false,
        }).save();
        res.json({
          statusCode: 201,
          message: "New practice has been created!",
          status: true,
          data: practice,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  app.post(
    `${basePath}/practices/get`,
    validateDefaultLectureRequest,
    async (req, res) => {
      const { token, lectureID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const practices = await Practice.find({ lectureID });
        res.json({
          statusCode: 200,
          message: "All Practices found!",
          status: true,
          data: practices,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
