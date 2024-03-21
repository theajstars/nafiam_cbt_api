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
import { generateRandomString } from "../Lib/Methods";
import { validateTokenSchema } from "../validation/course";
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
}
