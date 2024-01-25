import { Express, Request } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin";
import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Types";
import {
  AdminAuthRequiredRequest,
  OnboardStudentRequest,
} from "../Lib/Request";
import {
  returnSuccessResponseObject,
  UnauthorizedResponseObject,
} from "../Lib/Misc";
import { Student } from "../models/Student";
const basePath = "/admin";

export default function (app: Express) {
  app.post(`${basePath}/login`, async (req, res) => {
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

  app.post("/admin/onboard_student", async (req, res) => {
    const body: OnboardStudentRequest = req.body;
    const v = verifyToken(body.token);
    if (!body || !body.token || v.user !== "admin") {
      res.json(UnauthorizedResponseObject);
    } else {
      const { firstName, lastName, email, rank, id } = body;
      const student = await new Student({
        firstName,
        lastName,
        email,
        rank,
        id,
      }).save();
      if (student._id) {
        res.json(
          returnSuccessResponseObject("Student created successfully!", 201)
        );
      }
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
