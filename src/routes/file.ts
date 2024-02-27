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
const basePath = "/file-upload";

export default function (app: Express) {
  app.post(`${basePath}`, async (req, res) => {
    const { token } = req.body;
    const { id } = verifyToken(token);
    console.log(id, token, req.body);
  });
}
