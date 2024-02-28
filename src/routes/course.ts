import { Express } from "express";
import { verifyToken } from "../Lib/JWT";
import { generateRandomString } from "../Lib/Methods";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { DefaultResponse } from "../Lib/Responses";
import { Course } from "../models/Course";
import {
  validateCreateCourse,
  validateCreateCourseMaterial,
  validateGetAllCourseMaterials,
  validateGetAllCourses,
  validateGetSingleCourseSchema,
  validateUpdateCourse,
} from "../validation/course";
import { Material } from "../models/Material";

const basePath = "/course";

export default function (app: Express) {
  app.post(`${basePath}s/all`, validateGetAllCourses, async (req, res) => {
    const { token } = req.body;

    const { id, user } = verifyToken(token);

    if (user === "admin") {
      const course = Course.find({});
      res.json(<DefaultResponse>{
        status: true,
        statusCode: 201,
        message: "Course created successfully!",
        data: course,
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });

  app.post(
    `${basePath}s/lecturer/all`,
    validateGetAllCourses,
    async (req, res) => {
      const { token, lecturerID } = req.body;

      const { id, user } = verifyToken(token);

      if (user === "lecturer") {
        const courses = await Course.find({ lecturerID: lecturerID ?? id });
        res.json(<DefaultResponse>{
          status: true,
          statusCode: 200,
          message: "Courses found!",
          data: courses,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/get`,
    validateGetSingleCourseSchema,
    async (req, res) => {
      const { token, courseID } = req.body;

      const { id, user } = verifyToken(token);

      if (user === "lecturer" || user === "admin") {
        const course = await Course.findOne({ id: courseID });
        res.json(<DefaultResponse>{
          status: true,
          statusCode: 200,
          message: "Course details retrieved!",
          data: course,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(`${basePath}/create`, validateCreateCourse, async (req, res) => {
    const { title, code, description, department, token } = req.body;

    const { id, user } = verifyToken(token);

    if (user === "admin" || user === "lecturer") {
      const course = await new Course({
        id: generateRandomString(16),
        lecturerID: id,
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
    }
  });
  app.post(`${basePath}/update`, validateUpdateCourse, async (req, res) => {
    const { courseID, title, code, description, department, token } = req.body;

    const { id, user } = verifyToken(token);

    if (user === "admin" || user === "lecturer") {
      const course = await Course.findOneAndUpdate(
        { id: courseID },
        {
          title,
          code,
          description,
          department,
        }
      );
      res.json(<DefaultResponse>{
        status: true,
        statusCode: 201,
        message: "Course details updated successfully!",
        data: course,
      });
    }
  });

  app.post(
    `${basePath}/material/create`,
    validateCreateCourseMaterial,
    async (req, res) => {
      const { courseID, token, title, description, type, category, file } =
        req.body;

      const { id, user } = verifyToken(token);

      if (user === "admin" || user === "lecturer") {
        const courseMaterial = await new Material({
          id: generateRandomString(16),
          courseID,
          title,
          description,
          type,
          category,
          file,
        }).save();
        res.json(<DefaultResponse>{
          status: true,
          statusCode: 201,
          message: "Course Material uploaded successfully!",
          data: courseMaterial,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  app.post(
    `${basePath}/materials/get`,
    validateGetAllCourseMaterials,
    async (req, res) => {
      const { courseID, token } = req.body;

      const { id, user } = verifyToken(token);

      if (user === "admin" || user === "lecturer") {
        const materials = await Material.find({ courseID });
        res.json(<DefaultResponse>{
          status: true,
          statusCode: 200,
          message: "Found materials!",
          data: materials,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
