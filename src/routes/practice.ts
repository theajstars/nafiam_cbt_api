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
import { validateStudentSubmissionRequest } from "../validation/examination";
import { Student } from "../models/Student";
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
          studentID: studentID,
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
  // Get the practice of a lecture by a lecturer or admin
  app.post(
    `${basePath}/get/:practiceID`,
    validateTokenRequest,
    async (req, res) => {
      const { token } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user !== "student") {
        const practice = await Practice.findOne({
          id: req.params.practiceID,
        });

        res.json({
          statusCode: 200,
          message: "Practice found!",
          status: true,
          data: practice,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  // Get the practice of a lecture by a student
  app.post(
    `${basePath}/student/get/:practiceID`,
    validateDefaultPracticeRequest,
    async (req, res) => {
      const { token, courseID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const practiceID = req.params.practiceID;
        const practice = await Practice.findOne({
          id: practiceID,
        });
        const lecture = await Lecture.findOne({
          id: practice?.lecture?.id ?? "",
          isActive: true,
        });
        const attempts = await Attempt.find({ studentID: id });
        const hasStudentCompletedPreceedingLecturePractices = async () => {
          const practices = await Practice.find({
            courseID,
          });
          const currentPractice = practices.find((p) => p.id === practiceID);
          if (currentPractice && currentPractice.index === 1) {
            //This is the first practice
            return true;
          } else {
            const passed = practices.map((p) => {
              if (p.index < practice.index) {
                // Check for attempts for each practice with more than 50 Percent
                const pass = attempts.filter(
                  (a) => a.practiceID === p.id && a.percent >= 50
                );
                return pass.length > 0;
              } else {
                return true;
              }
            });
            console.log(passed);
          }
          // Check if student has passed each practice
        };
        const resolvedQuestions = practice.questions.map((q) => {
          return {
            id: q.id,
            title: q.title,
            options: q.options,
            answer: "unset",
          };
        });
        const resolvedPractice = {
          id: practice.id,
          lecture: { title: practice.lecture.title, id: practice.lecture.id },
          questions: resolvedQuestions,
          index: practice.index,
          dateCreated: practice.dateCreated,
          isEligible: await hasStudentCompletedPreceedingLecturePractices(),
        };

        res.json({
          statusCode: lecture ? 200 : 401,
          message: lecture
            ? "Practice found!"
            : "Unauthorized or Practice does not exist!",
          status: true,
          data: lecture ? resolvedPractice : null,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  // Submit practice attempt by student
  app.post(
    `${basePath}/submit`,
    validateStudentSubmissionRequest,
    async (req, res) => {
      const { token, practiceID, questions } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "student") {
        const practice = await Practice.findOne({ id: practiceID });

        const attempts = await Attempt.find({ studentID: id });
        const isStudentEligible = attempts.length < 3;
        if (isStudentEligible) {
          const practiceQuestions = practice.questions;
          const marksObtainable = practiceQuestions.length;
          const count = questions.map((q) => {
            const foundQuestion = practiceQuestions.find(
              (eQuestion) => eQuestion.id === q.id
            );
            return foundQuestion.answer === q.answer;
          });

          const correctCount = count.filter((val) => val === true);
          const percent = (correctCount.length / marksObtainable) * 100;

          const attempt = await new Attempt({
            id: generateRandomString(32),
            practiceID,
            studentID: id,
            score: correctCount.length,
            percent,
            timestamp: Date.now(),
          }).save();
          res.json({
            statusCode: 200,
            status: true,
            message: "Examination successfully graded!",
            data: attempt,
          });
        } else {
          res.json({
            statusCode: 401,
            status: true,
            message:
              "You are not eligible to write this examination. Please contact Admin",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
