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
} from "../Lib/Methods";
import { validateTokenRequest } from "../validation/course";
import { validateUpdatePasswordRequest } from "../validation/default";
import { Student } from "../models/Student";
import { Admin } from "../models/Admin";
import { Log } from "../models/Log";
import { validateGetAllLogsRequest } from "../validation/log";
const basePath = "/logs";
export default function (app: Express) {
  app.post(`${basePath}/all`, validateGetAllLogsRequest, async (req, res) => {
    const { token, timestamp, personnelID, action, userType, page, limit } =
      req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user === "admin") {
      const filter = {
        action,
        userType,
      };

      const logs = await Log.find(
        { ...removeEmptyFields(filter) },
        {},
        {
          skip: page === 1 ? 0 : page === 2 ? limit : (page - 1) * limit,
          limit,
        }
      );

      const totalCount = await Log.countDocuments({});

      res.json({
        status: true,
        statusCode: 200,
        data: logs,
        page,
        limit,
        rows: logs.length,
        total: totalCount,
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });
}
