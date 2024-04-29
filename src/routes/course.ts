import { Express } from "express";
import { verifyToken } from "../Lib/JWT";
import { generateRandomString } from "../Lib/Methods";
import { UnauthorizedResponseObject } from "../Lib/Misc";
import { DefaultResponse } from "../Lib/Responses";
import { Course } from "../models/Course";
import {
  validateCourseEnrollmentRequest,
  validateCreateCourse,
  validateDefaultCourseRequest,
  validateGetAllCourses,
  validateGetSingleCourseSchema,
  validateUpdateCourse,
} from "../validation/course";
import { Lecture } from "../models/Lecture";
import { Practice } from "../models/Practice";
import { Examination } from "../models/Examination";

const basePath = "/course";

export default function (app: Express) {
  app.post(`${basePath}s/all`, validateGetAllCourses, async (req, res) => {
    const { token } = req.body;

    const { id, user } = verifyToken(token);

    if (id && user) {
      const courses = await Course.find({});
      res.json(<DefaultResponse>{
        status: true,
        statusCode: 200,
        message: "Courses found!",
        data: courses,
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

      if (user && id) {
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
    const { title, code, description, school, token, lecturerID } = req.body;

    const { id, user } = verifyToken(token);

    if (user === "admin" || user === "lecturer") {
      const course = await new Course({
        id: generateRandomString(32),
        lecturerID: user === "admin" ? lecturerID : id,
        title,
        code,
        description,
        school,
        students: [],
        active: false,
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
    const { courseID, title, code, lecturerID, description, school, token } =
      req.body;

    const { id, user } = verifyToken(token);

    if (user === "admin" || user === "lecturer") {
      const course = await Course.findOneAndUpdate(
        { id: courseID },
        {
          title,
          code,
          school,
          lecturerID,
          description,
        }
      );
      res.json(<DefaultResponse>{
        status: true,
        statusCode: 200,
        message: "Course details updated successfully!",
        data: course,
      });
    }
  });

  app.post(
    `${basePath}/status/toggle`,
    validateDefaultCourseRequest,
    async (req, res) => {
      const { token, status, courseID } = req.body;

      const { id, user } = verifyToken(token);

      if (id && user && user === "lecturer") {
        const course = await Course.findOneAndUpdate(
          { id: courseID },
          {
            active: status,
          }
        );
        res.json(<DefaultResponse>{
          status: true,
          statusCode: 200,
          message: `Course set to ${status ? "active" : "inactive"}`,
          data: course,
        });
      }
    }
  );

  app.post(
    `${basePath}/enroll`,
    validateCourseEnrollmentRequest,
    async (req, res) => {
      const { courseID, token } = req.body;

      const { id, user } = verifyToken(token);

      if (id && user && user === "student") {
        //Check if course is active
        const isCourseActive = await Course.findOne({ id: courseID });
        if (isCourseActive && isCourseActive.active) {
          //Course exists and registration is ongoing
          const course = await Course.findOneAndUpdate(
            { id: courseID, active: true },
            { $push: { students: id } }
          );
          res.json(<DefaultResponse>{
            status: true,
            statusCode: 200,
            message: "Enrollment successful!",
            data: course,
          });
        } else {
          res.json(<DefaultResponse>{
            status: true,
            statusCode: 405,
            message: "You cannot register for this course!",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/student/dismiss`,
    validateCourseEnrollmentRequest,
    async (req, res) => {
      const { courseID, token, studentID } = req.body;

      const { id, user } = verifyToken(token);

      if (id && user && user !== "student") {
        const findCourse = await Course.findOne({ id: courseID });

        const course = await Course.findOneAndUpdate(
          { id: courseID },
          { students: findCourse.students.filter((s) => s !== studentID) }
        );
        res.json(<DefaultResponse>{
          status: true,
          statusCode: 200,
          message: "Dismissal successful!",
          data: course,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.delete(
    `${basePath}/delete`,
    validateDefaultCourseRequest,
    async (req, res) => {
      const { token, courseID } = req.body;

      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const course = await Course.deleteOne({ id: courseID });

        const lectures = await Lecture.deleteMany({ courseID });
        const practice = await Practice.deleteMany({ courseID });
        const examination = await Examination.deleteMany({ course: courseID });

        res.json({
          status: true,
          statusCode: 200,
          data: { course, lectures, practice, examination },
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
