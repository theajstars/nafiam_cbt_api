import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
import { Examination } from "../models/Examination";
import { returnSuccessResponseObject } from "../Lib/Misc";
import { generateRandomString } from "../Lib/Methods";
import { validateTokenSchema } from "../validation/course";
import { validateGetAllExaminations } from "../validation/examination";
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
        lecturerID: id,
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
  app.post(`${basePath}s/all`, validateGetAllExaminations, async (req, res) => {
    const { token, isAdmin } = req.body;
    const { id } = verifyToken(token);
    if (token) {
      const examinations = isAdmin
        ? await Examination.find({})
        : await Examination.find({ lecturerID: id });
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
  app.post(`${basePath}/get`, async (req, res) => {
    const { token, examinationID } = req.body;
    const { id } = verifyToken(token);
    const lecturer = await Lecturer.findOne({ id });
    if (token && lecturer) {
      const examination = await Examination.findOne({ id: examinationID });
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
  });
  app.delete(`${basePath}/delete`, async (req, res) => {
    const { token, examinationID } = req.body;
    const { id } = verifyToken(token);
    const lecturer = await Lecturer.findOne({ id });
    if (token && lecturer) {
      const examination = await Examination.findOneAndDelete({
        id: examinationID,
        lecturerID: id,
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
  });
  app.post(`${basePath}/edit`, async (req, res) => {
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
  });
}
