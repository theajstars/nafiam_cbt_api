import { Express, Request } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin";
import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";
import {
  AdminAuthRequiredRequest,
  OnboardStudentRequest,
} from "../Lib/Request";
import {
  returnSuccessResponseObject,
  UnauthorizedResponseObject,
} from "../Lib/Misc";
import { Student } from "../models/Student";
import { Course } from "../models/Course";
import { generateRandomString } from "../Lib/Methods";
import {
  validateOnboardStudent,
  validateSingleLecturerRequest,
  validateUpdateStudent,
} from "../validation/admin";
import { validateTokenSchema } from "../validation/course";
import { validateLoginRequest } from "../validation/default";
import { Log } from "../models/Log";
import {
  validateCreateLecturer,
  validateUpdateLecturer,
} from "../validation/admin";
import { Lecturer } from "../models/Lecturer";
const basePath = "/admin";

export default function (app: Express) {
  app.post(`${basePath}/login`, validateLoginRequest, async (req, res) => {
    const { id, password, navigatorObject } = req.body;
    const admin = await Admin.findOne({ email: id });
    if (admin) {
      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      const log = await new Log({
        personnelID: admin.id,
        id: generateRandomString(32),
        userType: "admin",
        action: "login",
        navigatorObject: navigatorObject,
        comments: isPasswordCorrect ? "Login successful!" : "Invalid Password",
        timestamp: Date.now(),
      }).save();
      res.json({
        status: true,
        statusCode: isPasswordCorrect ? 200 : 401,
        admin: isPasswordCorrect ? admin : null,
        token: isPasswordCorrect ? await createToken(admin.id, "admin") : null,
      });
    } else {
      res.json({
        status: true,
        statusCode: 401,
      });
    }
  });
  app.post(`${basePath}/profile/get`, validateTokenSchema, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user === "admin") {
      const admin = await Admin.findOne({ id }).select(
        "id firstName lastName email"
      );
      res.json({
        status: true,
        statusCode: 200,
        data: admin,
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });
  app.post(`${basePath}/verify_token`, async (req, res) => {
    const { token } = req.body;
    const { user, id } = verifyToken(token);
    if (!id || !user || user !== "admin") {
      res.json(UnauthorizedResponseObject);
    } else {
      const admin = await Admin.findOne({ id });
      if (admin !== null && admin.id) {
        res.json(<DefaultResponse>{
          status: true,
          statusCode: 200,
          data: admin,
          message: "Verified successfully!",
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  });

  app.post(
    "/admin/student/onboard",
    validateOnboardStudent,
    async (req, res) => {
      const {
        token,
        email,
        firstName,
        lastName,
        rank,
        gender,
        role,
        serviceNumber,
      } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const studentExists = await Student.findOne({
          $or: [{ email: email }, { serviceNumber }],
        });
        if (!studentExists) {
          const saltRounds = 10;

          const salt = await bcrypt.genSalt(saltRounds);
          const hash = await bcrypt.hash(lastName.toUpperCase(), salt);
          const student = await new Student({
            id: generateRandomString(32),
            email,
            firstName,
            lastName,
            rank,
            role,
            serviceNumber,
            gender,
            password: hash,
            // school,
          }).save();
          res.json({
            status: true,
            statusCode: 201,
            data: student,
            message: "New Student created",
          });
        } else {
          res.json({
            status: true,
            statusCode: 409,
            data: false,
            message: "Student exists!",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  app.post(
    `${basePath}/student/update`,
    validateUpdateStudent,
    async (req, res) => {
      const {
        studentID,
        token,
        email,
        firstName,
        lastName,
        rank,
        gender,
        role,
        serviceNumber,
      } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const studentExists = await Student.findOne({
          $or: [{ email: email }, { serviceNumber }],
        });
        if (studentExists && studentExists.id !== studentID) {
          res.json({
            status: true,
            statusCode: 409,
            data: { id: studentExists.id, studentID },
            message: "Student exists!",
          });
        } else {
          const student = await Student.findOneAndUpdate(
            { id: studentID },
            {
              id: generateRandomString(32),
              email,
              firstName,
              lastName,
              rank,
              role,
              serviceNumber,
              gender,
              // school,
            }
          );
          res.json({
            status: true,
            statusCode: 200,
            data: student,
            message: "Student updated",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  app.post("/admin/students/get", validateTokenSchema, async (req, res) => {
    const { token } = req.body;
    const { user, id } = verifyToken(token);
    if (!id || !user || user !== "admin") {
      res.json(UnauthorizedResponseObject);
    } else {
      const students = await Student.find({});
      res.json(<DefaultResponse>{
        data: students,
        status: true,
        statusCode: 200,
        message: "Students found!",
      });
    }
  });
  app.post("/admin/getStudent/:studentID", async (req, res) => {
    const body: AdminAuthRequiredRequest = req.body;

    const studentID = req.params.studentID;
    const v = verifyToken(body.token);
    if (!body || !body.token || v.user !== "admin") {
      res.json(UnauthorizedResponseObject);
    } else {
      const student = await Student.findOne({ id: studentID });
      res.json(<DefaultResponse>{
        data: student,
        status: true,
        statusCode: student ? 200 : 404,
      });
    }
  });
  app.delete(
    "/admin/student/:studentID",
    validateTokenSchema,
    async (req, res) => {
      const { token } = req.body;
      const { studentID } = req.params;
      const { user, id } = verifyToken(token);
      if (!id || !user || user !== "admin") {
        res.json(UnauthorizedResponseObject);
      } else {
        const student = await Student.findOneAndDelete({ id: studentID });
        res.json(<DefaultResponse>{
          data: student,
          status: true,
          statusCode: 204,
          message: "Student deleted!",
        });
      }
    }
  );

  //LECTURERS FUNCTIONALITY
  app.post(
    `${basePath}/lecturer/create`,
    validateCreateLecturer,
    async (req, res) => {
      const {
        token,
        email,
        firstName,
        lastName,
        rank,
        gender,
        role,
        serviceNumber,
      } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const lecturerExists = await Lecturer.findOne({
          $or: [{ email: email }, { serviceNumber }],
        });
        if (!lecturerExists) {
          const saltRounds = 10;

          const salt = await bcrypt.genSalt(saltRounds);
          const hash = await bcrypt.hash(lastName.toUpperCase(), salt);
          const lecturer = await new Lecturer({
            id: generateRandomString(32),
            email,
            firstName,
            lastName,
            rank,
            role,
            serviceNumber,
            gender,
            password: hash,
            // school,
          }).save();
          res.json({
            status: true,
            statusCode: 201,
            data: lecturer,
            message: "New Lecturer created",
          });
        } else {
          res.json({
            status: true,
            statusCode: 409,
            data: false,
            message: "Lecturer exists!",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/lecturer/update`,
    validateUpdateLecturer,
    async (req, res) => {
      const {
        lecturerID,
        token,
        email,
        firstName,
        lastName,
        rank,
        gender,
        role,
        serviceNumber,
      } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const lecturerExists = await Lecturer.findOne({
          $or: [{ email: email }, { serviceNumber }],
        });
        if (lecturerExists && lecturerExists.id !== lecturerID) {
          res.json({
            status: true,
            statusCode: 409,
            data: { id: lecturerExists.id, lecturerID },
            message: "Lecturer exists!",
          });
        } else {
          const lecturer = await Lecturer.findOneAndUpdate(
            { id: lecturerID },
            {
              id: generateRandomString(32),
              email,
              firstName,
              lastName,
              rank,
              role,
              serviceNumber,
              gender,
            }
          );
          res.json({
            status: true,
            statusCode: 200,
            data: lecturer,
            message: "Lecturer updated",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(`${basePath}/lecturer/get`, async (req, res) => {
    const { token, lecturerID } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user === "admin") {
      const lecturer = await Lecturer.findOne({ id: lecturerID }).select(
        "email firstName lastName id rank gender serviceNumber role"
      );

      res.json({
        status: true,
        statusCode: 200,
        data: lecturer,
        message: "Profile successfully retrieved!",
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });
  app.delete(
    `${basePath}/lecturer/delete`,
    validateSingleLecturerRequest,
    async (req, res) => {
      const { token, lecturerID } = req.body;

      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const lecturer = await Lecturer.findOneAndDelete({ id: lecturerID });
        res.json({
          status: true,
          statusCode: 200,
          data: lecturer,
          message: "Profile successfully deleted!",
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/lecturers/all/get`,
    validateTokenSchema,
    async (req, res) => {
      const { token } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const lecturers = await Lecturer.find({}).select(
          "email firstName lastName id rank gender role serviceNumber"
        );
        res.json({
          status: true,
          statusCode: 200,
          data: lecturers,
          message: "Lecturers retrieved!",
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
