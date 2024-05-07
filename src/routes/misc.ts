import { Express } from "express";
import bcrypt from "bcryptjs";

import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";

import { Instructor } from "../models/Instructor";
import { Examination } from "../models/Examination";
import {
  UnauthorizedResponseObject,
  returnSuccessResponseObject,
} from "../Lib/Misc";
import {
  genPassword,
  generateRandomString,
  removeEmptyFields,
  returnUnlessUndefined,
} from "../Lib/Methods";
import { validateTokenRequest } from "../validation/course";
import {
  validateDefaultFindUserRequest,
  validateUpdatePasswordRequest,
} from "../validation/default";
import { Student } from "../models/Student";
import { Admin } from "../models/Admin";
import { Log } from "../models/Log";
import { nigerianAirForceRanks } from "../Lib/Data";
const basePath = "/misc";
export default function (app: Express) {
  app.get("/", (req, res) => {
    res.json({
      status: "true",
      statusCode: 200,
      message: "Server is live!!",
    });
  });
  app.post(`${basePath}/ranks/get`, validateTokenRequest, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user) {
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
                  message: "Your password has been successfully updated!",
                });
              } else {
                res.json({
                  ...UnauthorizedResponseObject,
                  message: "Incorrect password",
                });
              }
              break;
            case "instructor":
              var isPasswordCorrect = await bcrypt.compare(
                oldPassword,
                (
                  await Instructor.findOne({ id })
                ).password
              );
              if (isPasswordCorrect) {
                await Instructor.findOneAndUpdate(
                  { id },
                  { password: newPassword, isChangedPassword: true }
                );
                res.json({
                  status: true,
                  statusCode: 200,
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
          await new Log({
            id: generateRandomString(32),
            personnelID: id,
            timestamp: Date.now(),
            navigatorObject,
            comments: isPasswordCorrect
              ? "Password changed!"
              : "Password was not changed",
            userType: user,
            action: "change_password",
            status: isPasswordCorrect ? "success" : "error",
          }).save();
        } else {
          res.json(UnauthorizedResponseObject);
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  app.post(
    `${basePath}/find`,
    validateDefaultFindUserRequest,
    async (req, res) => {
      const { token, searchString, userCase, rank, gender } = req.body;

      const { id, user } = verifyToken(token);
      if (id && user) {
        const filter = {
          $or: [
            {
              email: { $regex: ".*" + searchString + ".*", $options: "i" },
            },
            {
              serviceNumber: {
                $regex: ".*" + searchString + ".*",
                $options: "i",
              },
            },
            {
              firstName: {
                $regex: ".*" + searchString + ".*",
                $options: "i",
              },
            },
            {
              lastName: {
                $regex: ".*" + searchString + ".*",
                $options: "i",
              },
            },
          ],
          gender,
          rank,
        };
        switch (userCase) {
          case "student":
            const students = await Student.find({
              ...removeEmptyFields(filter),
            }).select("-password");
            res.json({
              status: true,
              statusCode: 200,
              message: "Students found!",
              data: students,
            });
            break;
          case "instructor":
            const instructors = await Instructor.find({
              ...removeEmptyFields(filter),
            }).select("-password");
            res.json({
              status: true,
              statusCode: 200,
              message: "Instructors found!",
              data: instructors,
            });
            break;
          case "admin":
            const admins = await Admin.find({
              ...removeEmptyFields(filter),
            }).select("-password");
            res.json({
              status: true,
              statusCode: 200,
              message: "Admins found!",
              data: admins,
            });
            break;
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
