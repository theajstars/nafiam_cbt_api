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
import { Log } from "../models/Log";
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
      const {
        token,
        newPassword: newPasswordString,
        oldPassword,
        user: userCase,
        navigatorObject,
      } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user) {
        if (user === userCase) {
          const newPassword = await genPassword(newPasswordString);
          switch (user) {
            case "student":
              var isPasswordCorrect = await bcrypt.compare(
                oldPassword,
                (
                  await Student.findOne({ id })
                ).password
              );
              if (isPasswordCorrect) {
                await Student.findOneAndUpdate(
                  { id },
                  { password: newPassword, isChangedPassword: true }
                );
                res.json({
                  status: true,
                  statusCode: 200,
                  data: {},
                  message:
                    "Your STUDENT password has been successfully updated!",
                });
              } else {
                res.json({
                  ...UnauthorizedResponseObject,
                  message: "Incorrect password",
                });
              }
              break;
            case "lecturer":
              var isPasswordCorrect = await bcrypt.compare(
                oldPassword,
                (
                  await Lecturer.findOne({ id })
                ).password
              );
              if (isPasswordCorrect) {
                await Lecturer.findOneAndUpdate(
                  { id },
                  { password: newPassword, isChangedPassword: true }
                );
                res.json({
                  status: true,
                  statusCode: 200,
                  data: {},
                  message: "Your password has been successfully updated!",
                });
              } else {
                res.json({
                  ...UnauthorizedResponseObject,
                  message: "Incorrect password",
                });
              }
              break;
            case "admin":
              var isPasswordCorrect = await bcrypt.compare(
                oldPassword,
                (
                  await Admin.findOne({ id })
                ).password
              );
              if (isPasswordCorrect) {
                await Admin.findOneAndUpdate(
                  { id },
                  { password: newPassword, isChangedPassword: true }
                );
                res.json({
                  status: true,
                  statusCode: 200,
                  data: {},
                  message: "Your password has been successfully updated!",
                });
              } else {
                res.json({
                  ...UnauthorizedResponseObject,
                  message: "Incorrect password",
                });
              }
              break;
          }
          const log = await new Log({
            id: generateRandomString(32),
            personnelID: id,
            timestamp: Date.now(),
            navigatorObject,
            comments: isPasswordCorrect
              ? "Password changed!"
              : "Password was not changed",
            userType: user,
            action: "change_password",
          }).save();
        } else {
          res.json(UnauthorizedResponseObject);
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
