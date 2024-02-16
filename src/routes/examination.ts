import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Types";

import { Lecturer } from "../models/Lecturer";
import { Examination } from "../models/Examination";
import { returnSuccessResponseObject } from "../Lib/Misc";
import { generateRandomString } from "../Lib/Methods";
const basePath = "/examination";
export default function (app: Express) {
  app.post(`${basePath}/create`, async (req, res) => {
    const { token, title, year, course } = req.body;
    const { id } = verifyToken(token);
    const lecturer = await Lecturer.findOne({ id });
    if (token && lecturer) {
      const examination = await new Examination({
        id: generateRandomString(16),
        title,
        year,
        course,
        completed: false,
        started: false,
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
  });
  app.post(`${basePath}s/all`, async (req, res) => {
    const { token } = req.body;
    const { id } = verifyToken(token);
    const lecturer = await Lecturer.findOne({ id });
    if (token && lecturer) {
      const examinations = await Examination.find({});
      res.json(
        returnSuccessResponseObject(
          "Examination list obtained!",
          200,
          examinations
        )
      );
    } else {
      res.json({
        status: true,
        statusCode: 401,
        message: "Unauthorized",
      });
    }
  });
}
