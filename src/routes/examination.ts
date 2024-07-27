import { Express } from "express";
import bcrypt from "bcryptjs";
import ws from "ws";
import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Instructor } from "../models/Instructor";
import { Examination } from "../models/Examination";
import {
  UnauthorizedResponseObject,
  returnSuccessResponseObject,
} from "../Lib/Misc";
import { generateRandomString } from "../Lib/Methods";
import { validateTokenRequest } from "../validation/course";
import {
  validateAddStudentsToExaminationRequest,
  validateApproveExaminationRequest,
  validateCreateExaminationBatchRequest,
  validateCreateExaminationSchema,
  validateDefaultBatchRequest,
  validateDefaultExaminationRequest,
  validateEditExaminationRequest,
  validateExaminationPasswordRequest,
  validateGetSingleExaminationBatchRequest,
  validateStudentBlacklistRequest,
  validateStudentSubmissionRequest,
} from "../validation/examination";
import { Course } from "../models/Course";
import { Attendance } from "../models/Attendance";
import { Result } from "../models/Results";
import { Student } from "../models/Student";
import { Admin } from "../models/Admin";
import { Batch } from "../models/Batch";
const basePath = "/examination";
export default function (app: Express) {
  app.post(
    `${basePath}/create`,
    validateCreateExaminationSchema,
    async (req, res) => {
      const { token, title, date, duration } = req.body;
      const { id } = verifyToken(token);
      const admin = await Admin.findOne({ id });
      if (token && admin) {
        const examination = await new Examination({
          id: generateRandomString(32),
          title,
          date,
          duration,
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
              : await Examination.find({ instructorID: id });
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
            : await Examination.findOne({
                id: examinationID,
                instructorID: id,
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
    `${basePath}s/unsullied/all`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token } = req.body;
      const { id, user } = verifyToken(token);

      if (id && user && user === "student") {
        const examination = await Batch.find({
          started: true,
          completed: false,
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
      const { token, batchID } = req.body;
      const { id, user } = verifyToken(token);

      if (id && user && user === "student") {
        const batch = await Batch.findOne({
          id: batchID,
          started: true,
          completed: false,
        });
        const resultIfExists = await Result.findOne({
          batchID,
          examinationID: batch.examinationID,
          studentID: id,
        });
        if (resultIfExists && resultIfExists.id) {
          //Student result exists for examination so student is not eligible to write paper
          res.json({
            status: true,
            statusCode: 401,
            message: "You have already written this paper",
          });
        } else {
          if (batch) {
            const didStudentRegisterForExamination =
              batch?.students.includes(id);
            // &&
            // !attendance.students.includes(id);

            res.json({
              status: true,
              statusCode: didStudentRegisterForExamination ? 200 : 401,
              message: didStudentRegisterForExamination
                ? "Examination found!"
                : "You are not eligible to write this examination",
              data: batch,
            });
          } else {
            res.json({
              status: true,
              statusCode: 404,
              message: "Examination does not exist",
            });
          }
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
      const { token, examinationID, questions, title, date, course } = req.body;
      const { id } = verifyToken(token);
      const admin = await Admin.findOne({ id });
      if (token && admin) {
        const examination = await Examination.findOneAndUpdate(
          { id: examinationID },
          { questions, title, date, course }
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
      const admin = await Admin.findOne({ id });
      if (id && user === "admin" && admin) {
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
    `${basePath}/add-students`,
    validateAddStudentsToExaminationRequest,
    async (req, res) => {
      const { token, examinationID, students } = req.body;
      const { id, user } = verifyToken(token);
      console.log(examinationID, students);
      if (!id || !user || user !== "admin") {
        res.json(UnauthorizedResponseObject);
      } else {
        const examination = await Examination.findOneAndUpdate(
          {
            id: examinationID,
          },
          { students }
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
      const { token, batchID, isAdmin } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && isAdmin && user !== "student") {
        const batch = await Batch.findOne({ id: batchID });
        const students = batch.students;
        const studentFullRecords = await Student.find({
          id: { $in: students },
        });
        console.log(studentFullRecords, students);
        res.json({
          statusCode: 200,
          message: "Examination eligible students found!",
          data: studentFullRecords,
          status: true,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/change-password`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, batchID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const password = generateRandomString(6, "ALPHABET").toUpperCase();
        await Batch.findOneAndUpdate(
          {
            id: batchID,
          },
          { started: true, password }
        );

        res.json({
          statusCode: 200,
          status: true,
          message: "Examination password has been changed!",
          data: { password },
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/create-batch`,
    validateCreateExaminationBatchRequest,
    async (req, res) => {
      const { token, examinationID, batch, students } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user === "admin") {
        const examination = await Examination.findOne({ id: examinationID });
        const existingBatch = await Batch.findOne({ batchNumber: batch });
        if (existingBatch && existingBatch.id) {
          res.json({
            statusCode: 409,
            status: true,
            message: "Batch already exists!",
          });
        } else {
          const newBatch = await new Batch({
            id: generateRandomString(32),
            examinationID,
            title: `${examination.title} Batch ${batch}`,
            batchNumber: batch,
            duration: examination.duration,
            date: examination.date,
            approved: true,
            published: true,
            started: false,
            completed: false,
            questions: examination.questions,
            students,
            password: "",
            blacklist: [],
          }).save();
          res.json({
            statusCode: 201,
            status: true,
            message: "Examination batch has been created!",
            data: newBatch,
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/batches/all`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, examinationID } = req.body;
      const { id, user } = verifyToken(token);
      if (!id || !user) {
        res.json(UnauthorizedResponseObject);
      } else {
        const batches = await Batch.find({ examinationID });
        res.json({
          statusCode: 200,
          status: true,
          message: "Examination batches retrieved!",
          data: batches,
        });
      }
    }
  );
  app.post(
    `${basePath}/batch/get`,
    validateGetSingleExaminationBatchRequest,
    async (req, res) => {
      const { token, batchID } = req.body;
      const { id, user } = verifyToken(token);
      if (!id || !user) {
        res.json(UnauthorizedResponseObject);
      } else {
        const batches = await Batch.findOne({ id: batchID });
        res.json({
          statusCode: 200,
          status: true,
          message: "Examination batch retrieved!",
          data: batches,
        });
      }
    }
  );
  app.post(
    `${basePath}/start`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, batchID, isAdmin } = req.body;
      const { id, user } = verifyToken(token);
      if (!isAdmin || !id || !user || user !== "admin") {
        res.json(UnauthorizedResponseObject);
      } else {
        const password = generateRandomString(6, "ALPHABET").toUpperCase();
        const batch = await Batch.findOneAndUpdate(
          {
            id: batchID,
          },
          { started: true, password }
        );
        await new Attendance({
          id: generateRandomString(32),
          batchID,
          examinationID: batch.examinationID,
          timestamp: Date.now(),
          students: [],
        }).save();
        res.json({
          statusCode: 200,
          status: true,
          message: "Examination Batch starting",
          data: { password },
        });
      }
    }
  );
  app.post(
    `${basePath}/end`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, batchID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const batch = await Batch.findOneAndUpdate(
          {
            id: batchID,
          },
          { completed: true }
        );

        res.json({
          statusCode: 200,
          status: true,
          message: "Examination completed",
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/redo`,
    validateDefaultExaminationRequest,
    async (req, res) => {
      const { token, examinationID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const examination = await Examination.findOneAndUpdate(
          {
            id: examinationID,
          },
          { completed: false, started: false }
        );

        res.json({
          statusCode: 200,
          status: true,
          message: "Examination can be taken again",
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/validate-password`,
    validateExaminationPasswordRequest,
    async (req, res) => {
      const { token, batchID, password } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const batch = await Batch.findOne({
          id: batchID,
        });
        if (batch.blacklist.includes(id)) {
          res.json({
            status: true,
            statusCode: 401,
            messasge:
              "You are not permitted to write this paper. Please contact Admin!",
          });
        } else {
          if (password === batch.password) {
            const attendance = await Attendance.findOne({ batchID });
            if (!attendance.students.includes(id)) {
              await Attendance.findOneAndUpdate(
                { batchID },
                { $push: { students: id } }
              );
            }
          }
          res.json({
            statusCode: password === batch.password ? 200 : 404,
            status: true,

            message:
              password === batch.password
                ? "Correct password!"
                : "Incorrect password",
            data: { password },
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  app.post(
    `${basePath}/blacklist/get`,
    validateDefaultBatchRequest,
    async (req, res) => {
      const { token, batchID } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user !== "student") {
        const batch = await Batch.findOne({ id: batchID });
        res.json({
          status: true,
          statusCode: 200,
          data: batch?.blacklist ?? [],
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/blacklist/update`,
    validateStudentBlacklistRequest,
    async (req, res) => {
      const { token, batchID, studentID, action } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        if (action === "blacklist") {
          //Add Student to examination blacklist
          const batch = await Batch.findOneAndUpdate(
            { id: batchID },
            { $push: { blacklist: studentID } }
          );
          res.json({
            status: true,
            statusCode: 200,
            message: `Student has been blacklisted from ${batch.title}`,
          });
        } else {
          const batch = await Batch.findOne({ id: batchID });
          const newBlacklist = batch.blacklist.filter((s) => s !== studentID);
          await Batch.findOneAndUpdate(
            { id: batchID },
            { blacklist: newBlacklist }
          );
          res.json({
            status: true,
            statusCode: 200,
            message: `Student has been whitelisted into ${batch.title}`,
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/submit-paper`,
    validateStudentSubmissionRequest,
    async (req, res) => {
      const { token, batchID, questions } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "student") {
        const batch = await Batch.findOne({ id: batchID });

        const student = await Student.findOne({ id });
        const attendance = await Attendance.findOne({
          batchID: batchID,
        });
        const isStudentInBlacklist = batch.blacklist.includes(id);
        const students = attendance.students;
        if (students.includes(id) && !isStudentInBlacklist) {
          const examinationQuestions = batch.questions;
          const marksObtainable = examinationQuestions.length;
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
              title: batch.title,
              date: Date.now(),
              questions: batch.questions,
              studentQuestions: questions,
            },
            attendance: {
              date: attendance.timestamp,
            },
          };
          const fullResultDetails = await new Result({
            id: generateRandomString(32),
            examinationID: batch.examinationID,
            batchID,
            studentID: id,
            name: student.name,
            rank: student.rank,
            unit: student.unit,

            serviceNumber: student.serviceNumber,
            ...result,
          }).save();
          res.json({
            statusCode: 200,
            status: true,
            message: "Examination successfully graded!",
            data: fullResultDetails,
          });
        } else {
          res.json({
            statusCode: 401,
            status: true,
            message:
              "You are not eligible to write this examination. Please contact Admin",
          });
        }
        // const
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/batches/get-completed`,

    async (req, res) => {
      const { token, page, limit } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        const batches = await Batch.find(
          { completed: true },

          {},

          {
            skip: page === 1 ? 0 : page === 2 ? limit : (page - 1) * limit,
            limit,
          }
        );
        const attendances = await Attendance.find();
        const results = await Result.find();
        res.json({
          statusCode: 200,
          status: true,
          message: "Examinations found!",
          data: { batches, attendances, results },
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
