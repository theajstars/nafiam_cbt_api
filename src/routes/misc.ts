import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Lecturer } from "../models/Lecturer";
import { Examination } from "../models/Examination";
import {
  UnauthorizedResponseObject,
  returnSuccessResponseObject,
} from "../Lib/Misc";
import { genPassword, generateRandomString } from "../Lib/Methods";
import { validateTokenSchema } from "../validation/course";
import { validateUpdatePasswordRequest } from "../validation/default";
import { Student } from "../models/Student";
import { Admin } from "../models/Admin";
const basePath = "/misc";
export default function (app: Express) {
  app.get("/", (req, res) => {
    res.json({
      status: "true",
      statusCode: 200,
      message: "Server is live!!",
    });
  });
  app.post(`${basePath}/ranks/get`, validateTokenSchema, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user) {
      const nigerianAirForceRanks = [
        "Marshal of the Nigerian Air Force",
        "Air Chief Marshal",
        "Air Marshal",
        "Air Vice Marshal",
        "Air Commodore",
        "Group Captain",
        "Wing Commander",
        "Squadron Leader",
        "Flight Lieutenant",
        "Flying Officer",
        "Pilot Officer",
        "Air Warrant Officer",
        "Master Warrant Officer",
        "Warrant Officer",
        "Flight Sergeant",
        "Sergeant",
        "Corporal",
        "Lance Corporal",
      ];

      res.json({
        status: true,
        statusCode: 200,
        message: "List of ranks",
        data: nigerianAirForceRanks,
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });
  app.post(
    `${basePath}/password/update`,
    validateUpdatePasswordRequest,
    async (req, res) => {
      const { token, password, user: userCase } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        if (user === userCase) {
          const newPassword = await genPassword(password);
          switch (userCase) {
            case "student":
              Student.findOneAndUpdate(
                { id },
                { password: newPassword, isChangedPassword: true }
              );
              break;
            case "lecturer":
              Lecturer.findOneAndUpdate(
                { id },
                { password: newPassword, isChangedPassword: true }
              );
              break;
            case "admin":
              Admin.findOneAndUpdate(
                { id },
                { password: newPassword, isChangedPassword: true }
              );
              break;
          }
          res.json({
            status: true,
            statusCode: 200,
            data: {},
            message: "Your password has been successfully updated!",
          });
        } else {
          res.json(UnauthorizedResponseObject);
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
