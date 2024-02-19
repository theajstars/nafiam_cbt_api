import { Express } from "express";
import { verifyToken } from "../Lib/JWT";
import { generateRandomString } from "../Lib/Methods";
import { DefaultResponse } from "../Lib/Types";
import { Course } from "../models/Course";

const basePath = "/course";
export default function (app: Express) {
  app.post(`${basePath}/create`, async (req, res) => {
    const { title, code, description, department, token } = req.body;

    if (!token) {
      res.json({
        status: true,
        statusCode: 401,
        message: "Unauthorized",
      });
    } else {
      const { id, user } = verifyToken(token);

      if (user === "admin" || user === "lecturer") {
        const course = await new Course({
          id: generateRandomString(16),
          title,
          code,
          description,
          department,
        }).save();

        res.json(<DefaultResponse>{
          status: true,
          statusCode: 201,
          message: "Course created successfully!",
          data: course,
        });
      } else {
        res.json({
          status: true,
          statusCode: 401,
          message: "Unauthorized",
        });
      }
    }
  });
}
