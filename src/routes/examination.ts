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
  validateExaminationPasswordRequest,
  validateStudentSubmissionRequest,
} from "../validation/examination";
import { Course } from "../models/Course";
import { Attendance } from "../models/Attendance";
import { Result } from "../models/Results";
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
          courseTitle: course.title,
          approved: false,
          completed: false,
          published: false,
          started: false,
          password: "",
          students: course.students,
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
  app.post(
    `${basePath}s/unsullied/all`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token } = req.body;
      const { id, user } = verifyToken(token);

      if (id && user && user === "student") {
        const examination = await Examination.find({
          started: true,
          students: { $in: [id] },
        });

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
  app.post(
    `${basePath}/unsullied/get`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, examinationID } = req.body;
      const { id, user } = verifyToken(token);

      if (id && user && user === "student") {
        const examination = await Examination.findOne({
          id: examinationID,
          started: true,
        });

        if (examination) {
          const didStudentRegisterForExamination =
            examination.students.includes(id);
          res.json({
            status: true,
            statusCode: didStudentRegisterForExamination ? 200 : 401,
            message: didStudentRegisterForExamination
              ? "Examination found!"
              : "You are not eligible to write this examination",
            data: examination,
          });
        } else {
          res.json({
            status: true,
            statusCode: 404,
            message: "Examination does not exist",
          });
        }
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
    `${basePath}/students/all`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, examinationID, isAdmin } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && isAdmin && user !== "student") {
        const examination = await Examination.findOne({ id: examinationID });
        const students = examination.students;
        res.json({
          statusCode: 200,
          message: "Examination eligible students found!",
          data: students,
          status: true,
        });
      } else {
        res.json(UnauthorizedResponseObject);
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
        await new Attendance({
          id: generateRandomString(32),
          examinationID,
          timestamp: Date.now(),
          students: [],
        }).save();
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
    `${basePath}/validate-password`,
    validateExaminationPasswordRequest,
    async (req, res) => {
      const { token, examinationID, password } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const examination = await Examination.findOne({
          id: examinationID,
        });
        if (password === examination.password) {
          await Attendance.findOneAndUpdate(
            { examinationID },
            { $push: { students: id } }
          );
        }
        res.json({
          statusCode: password === examination.password ? 200 : 404,
          status: true,

          message:
            password === examination.password
              ? "Correct password!"
              : "Incorrect password",
          data: { password },
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  app.post(
    `${basePath}/submit-paper`,
    validateStudentSubmissionRequest,
    async (req, res) => {
      const { token, examinationID, questions } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "student") {
        const examination = await Examination.findOne({ id: examinationID });
        const course = await Course.findOne({ id: examination.course });
        const attendance = await Attendance.findOne({
          examinationID: examinationID,
        });
        const students = attendance.students;
        if (students.includes(id)) {
          const examinationQuestions = examination.selectedQuestions.map(
            (sQuestion) => {
              return examination.questions.find(
                (eQuestion) => eQuestion.id === sQuestion
              );
            }
          );
          const marksObtainable = examination.selectedQuestions.length;
          const count = questions.map((q) => {
            const foundQuestion = examinationQuestions.find(
              (eQuestion) => eQuestion.id === q.id
            );
            return foundQuestion.answer === q.answer;
          });

          const correctCount = count.filter((val) => val === true);
          const percent = (correctCount.length / marksObtainable) * 100;
          const result = {
            grading: {
              marksObtainable,
              numberCorrect: correctCount.length,
              percent,
            },
            exam: {
              title: examination.title,
              courseTitle: examination.courseTitle,
              year: examination.year,
            },
            course: {
              title: course.title,
              code: course.code,
              school: course.school,
            },
            attendance: {
              date: attendance.timestamp,
            },
          };
          await new Result({
            id: generateRandomString(32),
            examinationID,
            studentID: id,
            ...result,
          }).save();
          res.json({
            statusCode: 200,
            status: true,
            message: "Examination successfully graded!",
            data: result,
          });
          console.log("Marks Obtainable", marksObtainable);
        } else {
          res.json({
            statusCode: 401,
            status: true,
            message: "You are not eligible to write this examination",
          });
        }
        // const
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
