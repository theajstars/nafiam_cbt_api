import { Express, Request } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin";
import { createToken, verifyToken } from "../Lib/JWT";
import { validateTokenSchema } from "../validation/course";
import { School } from "../models/Schools";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { generateRandomString } from "../Lib/Methods";
import {
  validateCreateSchoolRequest,
  validateUpdateSchoolRequest,
} from "../validation/admin";

const basePath = "/school";

export default function (app: Express) {
  app.post(`${basePath}s/get`, validateTokenSchema, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user) {
      const schools = await School.find();
      res.json({
        status: true,
        statusCode: 200,
        data: schools,
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });
  app.post(
    `${basePath}/create`,
    validateCreateSchoolRequest,
    async (req, res) => {
      const { token, name, dean } = req.body;
      // 'dean' refers to lecturer ID
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const school = await new School({
          id: generateRandomString(32),
          name,
          dean,
        }).save();
        res.json({
          status: true,
          statusCode: 201,
          data: school,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/update`,
    validateUpdateSchoolRequest,
    async (req, res) => {
      const { token, name, dean, schoolID } = req.body;
      // 'dean' refers to lecturer ID
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const school = await School.findOneAndUpdate(
          { id: schoolID },
          {
            name,
            dean,
          }
        );
        res.json({
          status: true,
          statusCode: 200,
          data: school,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
