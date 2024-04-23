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
import { validateStudentSubmissionRequest } from "../validation/examination";
import { Attempt } from "../models/Attempt";
import { Student } from "../models/Student";
const basePath = "/lecture";
export default function (app: Express) {
  // Create a new Lecture
  app.post(
    `${basePath}/create`,
    validateCreateLectureRequest,
    async (req, res) => {
      const { title, courseID, description, files, token } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "lecturer") {
        //Get Existing lectures for the course
        const lectures = await Lecture.find({ courseID });
        const index = lectures.length + 1;
        const lecture = await new Lecture({
          id: generateRandomString(32),
          title,
          description,
          courseID,
          dateCreated: Date.now(),
          files,
          isActive: false,
        }).save();
        const practice = await new Practice({
          id: generateRandomString(32),
          lecture: {
            id: lecture?.id ?? "",
            title: lecture?.title ?? "",
          },
          courseID,
          index,
          questions: [],
          dateCreated: Date.now(),
        }).save();
        // Update lecture to include practice
        await Lecture.findOneAndUpdate(
          { id: lecture?.id },
          { practiceID: practice.id }
        );
        res.json({
          statusCode: 201,
          message: "Lecture has been added!",
          status: true,
          data: { lecture, practice },
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  // Get all lectures for a course
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
  // Get details for a single lecture
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
  // Update active status for a single lecture
  app.post(
    `${basePath}/status/:lectureID`,
    validateToggleLectureStatusRequest,
    async (req, res) => {
      const { token, status } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "lecturer") {
        const lecture = await Lecture.findOneAndUpdate(
          { id: req.params.lectureID },
          { isActive: status }
        );
        res.json({
          statusCode: 200,
          message: status
            ? "Lecture has been activated!"
            : "Lecture has been deactivated",
          status: true,
          data: lecture,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  // Update details of a single lecture
  app.post(
    `${basePath}/update/:lectureID`,
    validateUpdateLectureRequest,
    async (req, res) => {
      const { lectureID, title, description, files, token } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "lecturer") {
        const lecture = await Lecture.findOneAndUpdate(
          {
            id: req.params.lectureID ?? lectureID,
          },
          { title, description, files }
        );
        const practice = await Practice.findOneAndUpdate(
          {
            "lecture.id": lectureID,
          },
          { lecture: { title: title, id: lectureID } }
        );
        res.json({
          statusCode: 200,
          message: "Lecture has been updated!",
          status: true,
          data: { lecture, practice },
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  //Delete a single lecture, this will also delete the lecture's practice questions
  app.delete(
    `${basePath}/delete`,
    validateDefaultLectureRequest,
    async (req, res) => {
      const { token, lectureID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "lecturer") {
        const lecture = await Lecture.findOneAndDelete({ id: lectureID });
        const practice = await Practice.findOneAndDelete({
          "lecture.id": lectureID,
        });
        res.json({
          statusCode: 204,
          message: "Lecture has been deleted!",
          status: true,
          data: { lecture, practice },
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  // Update the questions of the lecture
  app.post(
    `${basePath}/practice/update`,
    validateUpdatePracticeQuestionsRequest,
    async (req, res) => {
      const { token, lectureID, questions } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "lecturer") {
        const practice = await Practice.findOneAndUpdate(
          {
            "lecture.id": lectureID,
          },
          { questions }
        );
        res.json({
          statusCode: 200,
          message: "Practice has been updated!",
          status: true,
          data: practice,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
