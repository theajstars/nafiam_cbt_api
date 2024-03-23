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
import { validateGetAllLogsRequest } from "../validation/log";
const basePath = "/misc";
export default function (app: Express) {
  app.get("/", (req, res) => {
    res.json({
      status: "true",
      statusCode: 200,
      message: "Server is live!!",
    });
  });
  app.post(`${basePath}/all`, validateGetAllLogsRequest, async (req, res) => {
    const { timestamp, personnelID, action, page, limit } = req.body;
    const totalCount = await Log.countDocuments({
      personnelID,
      action,
      timestamp,
    });
  });
}
