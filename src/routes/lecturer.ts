import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
import { validateTokenSchema } from "../validation/course";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { validateCreateLecturer } from "../validation/lecturer";
import { generateRandomString } from "../Lib/Methods";
const basePath = "/lecturer";
export default function (app: Express) {
  app.post(`${basePath}/create`, validateCreateLecturer, async (req, res) => {
    const {
      token,
      email,
      firstName,
      lastName,
      rank,
      role,

      serviceNumber,
    } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user === "admin") {
      const lecturerExists = await Lecturer.findOne({
        $or: [{ email: email }, { serviceNumber }],
      });
      if (!lecturerExists) {
        const lecturer = await new Lecturer({
          id: generateRandomString(32),
          email,
          firstName,
          lastName,
          rank,
          role,
          serviceNumber,

          password: lastName.toUpperCase(),
          // department,
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
          data: lecturerExists,
          message: "New Lecturer created",
        });
      }
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });
  app.post(`${basePath}/login`, async (req, res) => {
    const { id, password } = req.body;
    console.log({ id, password });
    const lecturer = await Lecturer.findOne({ email: id });
    if (lecturer) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        lecturer.password
      );

      res.json({
        status: true,
        statusCode: isPasswordCorrect ? 200 : 401,
        message: "Logged In!",
        token: await createToken(lecturer.id, "lecturer"),
      });
    } else {
      res.json({
        status: true,
        statusCode: 401,
        message: "Invalid email and password",
      });
    }
  });
  app.post(`${basePath}/profile/get`, async (req, res) => {
    const { token } = req.body;
    const { id } = verifyToken(token);
    const lecturer = await Lecturer.findOne({ id }).select(
      "email firstName lastName id rank"
    );
    if (lecturer) {
      console.log(lecturer);
      res.json({
        status: true,
        statusCode: 200,
        data: lecturer,
        message: "Profile successfully retrieved!",
      });
    } else {
      res.json({
        status: true,
        statusCode: 401,
        message: "Invalid email and password",
      });
    }
  });
  app.post(`${basePath}s/all/get`, validateTokenSchema, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user === "admin") {
      const lecturers = await Lecturer.find({}).select(
        "email firstName lastName id rank"
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
  });
}
