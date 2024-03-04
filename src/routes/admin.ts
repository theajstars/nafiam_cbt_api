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
import { validateOnboardStudent } from "../validation/admin";
import { validateTokenSchema } from "../validation/course";
import { validateLoginRequest } from "../validation/default";
const basePath = "/admin";

export default function (app: Express) {
  app.post(`${basePath}/login`, validateLoginRequest, async (req, res) => {
    const { id, password } = req.body;
    const admin = await Admin.findOne({ email: id });
    if (admin) {
      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      res.json({
        status: true,
        statusCode: isPasswordCorrect ? 200 : 401,
        admin: isPasswordCorrect ? admin : null,
        token: await createToken(admin.id, "admin"),
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
        "firstName lastName email"
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
    const v = verifyToken(token);
    if (!v || v.user !== "admin") {
      res.json(UnauthorizedResponseObject);
    } else {
      res.json(<DefaultResponse>{
        status: true,
        statusCode: 200,
        data: v,
        message: "Verified successfully!",
      });
    }
  });

  app.post(
    "/admin/student/onboard",
    validateOnboardStudent,
    async (req, res) => {
      const { token, firstName, lastName, email } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const saltRounds = 10;

        bcrypt.genSalt(saltRounds, function (err, salt) {
          const password = generateRandomString(8);
          bcrypt.hash(password, salt, async (err, hash) => {
            const student = await new Student({
              id: generateRandomString(48),
              firstName,
              lastName,
              email,
              password: hash,
            }).save();
            res.json({
              status: true,
              statusCode: 201,
              message: "Student successfully onboarded!",
              data: student,
              password,
            });
          });
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  app.post("/admin/students/get", validateTokenSchema, async (req, res) => {
    const { token } = req.body;
    const { user, id } = verifyToken(token);
    if (id && user && user !== "admin") {
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
}
