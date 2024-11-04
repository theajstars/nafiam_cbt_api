import { Express, Request } from "express";
import bcrypt from "bcryptjs";
import { Admin, AdminProps } from "../models/Admin";
import { createToken, verifyToken } from "../Lib/JWT";
import { DefaultResponse } from "../Lib/Responses";
import {
  AdminAuthRequiredRequest,
  OnboardStudentRequest,
} from "../Lib/Request";
import {
  returnSuccessResponseObject,
  UnauthorizedResponseObject,
} from "../Lib/Misc";
import { Student } from "../models/Student";
import { Course } from "../models/Course";
import { genPassword, generateRandomString } from "../Lib/Methods";
import {
  validateCreateAdminRequest,
  validateOnboardStudent,
  validateSingleInstructorRequest,
  validateUpdateAdminRequest,
  validateUpdateStudent,
} from "../validation/admin";
import { validateTokenRequest } from "../validation/course";
import {
  validateDefaultProfileUpdateRequest,
  validateLoginRequest,
} from "../validation/default";
import { Log } from "../models/Log";
import {
  validateCreateInstructor,
  validateUpdateInstructor,
} from "../validation/admin";
import { Instructor } from "../models/Instructor";
import { year } from "../Lib/Data";
const basePath = "/admin";

export default function (app: Express) {
  app.post(`${basePath}/login`, validateLoginRequest, async (req, res) => {
    const { id, password, navigatorObject } = req.body;
    const admin = await Admin.findOne({
      $or: [{ serviceNumber: id }, { email: id }],
    });

    if (admin) {
      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      await new Log({
        id: generateRandomString(32),
        personnelID: admin.id,
        userType: "admin",
        action: "login",
        navigatorObject: navigatorObject,
        comments: isPasswordCorrect ? "Login successful!" : "Invalid Password",
        timestamp: Date.now(),
        status: isPasswordCorrect ? "success" : "error",
      }).save();
      res.json({
        status: true,
        statusCode: isPasswordCorrect ? 200 : 401,
        token: isPasswordCorrect ? await createToken(admin.id, "admin") : null,
      });
    } else {
      res.json({
        status: true,
        message: "Password and ID combination not found!",
        statusCode: 401,
      });
    }
  });
  app.post(
    `${basePath}/profile/get`,
    validateTokenRequest,
    async (req, res) => {
      const { token } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const admin = await Admin.findOne({ id }).select("-password");
        res.json({
          status: true,
          statusCode: 200,
          data: admin,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/profile/update`,
    validateDefaultProfileUpdateRequest,
    async (req, res) => {
      const { token, firstName, lastName, email, serviceNumber, rank } =
        req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const admin = await Admin.findOneAndUpdate(
          { id },
          {
            firstName,
            lastName,
            email,
            serviceNumber: serviceNumber ?? undefined,
            rank: rank ?? undefined,
          }
        );
        res.json({
          status: true,
          statusCode: 200,
          data: admin,
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(`${basePath}s/all`, validateTokenRequest, async (req, res) => {
    const { token } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user && user === "admin") {
      const admins = await Admin.find({}).select("-password");
      res.json({
        status: true,
        statusCode: 200,
        data: admins,
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });
  app.post(
    `${basePath}/create`,
    validateCreateAdminRequest,
    async (req, res) => {
      const { token, name, serviceNumber, rank } = req.body as AdminProps & {
        token: string;
      };
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        //Check if Admin already exists
        const adminExists = await Admin.findOne({
          serviceNumber,
        });
        if (adminExists && adminExists.id) {
          res.json({
            status: true,
            message: "Service number for admin already exists!",
            statusCode: 409,
          });
        } else {
          const password = await genPassword(`NAFIAM${year}`);

          const admin = await new Admin({
            id: generateRandomString(32),
            name,
            serviceNumber: serviceNumber?.toUpperCase(),
            rank,
            password,
            dateCreated: Date.now(),
            superUser: false,
            isChangedPassword: false,
          }).save();
          res.json({
            status: true,
            statusCode: 201,
            data: admin,
            message: "Admin created!",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/update`,
    validateUpdateAdminRequest,
    async (req, res) => {
      const { adminID, token, name, serviceNumber, rank } =
        req.body as AdminProps & { token: string; adminID: string };
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        //Check if other admin has email or service number
        const adminExistsWithPersonalInformation = await Admin.findOne({
          serviceNumber,
        });
        if (
          !adminExistsWithPersonalInformation ||
          (adminExistsWithPersonalInformation &&
            adminExistsWithPersonalInformation.id &&
            adminExistsWithPersonalInformation.id === adminID)
        ) {
          //Admin with information is admin to be modified
          const admin = await Admin.findOneAndUpdate(
            { id: adminID },
            {
              token,
              name,
              serviceNumber: serviceNumber === "UNSET" ? "" : serviceNumber,

              rank,
            }
          );
          res.json({
            status: true,
            statusCode: 200,
            data: admin,
            message: "Admin profile updated!",
          });
        } else {
          res.json({
            status: true,
            statusCode: 409,
            message: "Duplicate record found!",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.delete(
    "/admin/delete/:adminID",
    validateTokenRequest,
    async (req, res) => {
      const { token } = req.body;
      const { adminID } = req.params;
      const { user, id } = verifyToken(token);
      if (!id || !user || user !== "admin") {
        res.json(UnauthorizedResponseObject);
      } else {
        const admin = await Admin.deleteOne({ id: adminID });
        res.json(<DefaultResponse>{
          data: admin,
          status: true,
          statusCode: 204,
          message: "Admin deleted!",
        });
      }
    }
  );
  app.post(`${basePath}/verify_token`, async (req, res) => {
    const { token } = req.body;
    const { user, id } = verifyToken(token);
    if (!id || !user || user !== "admin") {
      res.json(UnauthorizedResponseObject);
    } else {
      const admin = await Admin.findOne({ id });
      if (admin !== null && admin.id) {
        res.json(<DefaultResponse>{
          status: true,
          statusCode: 200,
          data: admin,
          message: "Verified successfully!",
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  });

  app.post(
    "/admin/student/onboard",
    validateOnboardStudent,
    async (req, res) => {
      const {
        token,
        name,

        rank,
        unit,
        trade,
        gender,
        role,
        isNafiam,
        serviceNumber,
      } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const studentExists = await Student.findOne({
          serviceNumber,
        });
        if (!studentExists) {
          const saltRounds = 10;
          const password = await genPassword(`NAFIAM${year}`);
          const student = await new Student({
            id: generateRandomString(32),
            name,
            rank,
            unit,
            trade,
            gender,
            role,
            isNafiam,
            serviceNumber: serviceNumber === "UNSET" ? "" : serviceNumber,

            isChangedPassword: false,
            password: password,
            dateCreated: Date.now(),
          }).save();
          res.json({
            status: true,
            statusCode: 201,
            data: student,
            message: "New Student created",
          });
        } else {
          res.json({
            status: true,
            statusCode: 409,
            data: false,
            message: "Student exists!",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  app.post(
    `${basePath}/student/update`,
    validateUpdateStudent,
    async (req, res) => {
      const {
        token,
        studentID,
        name,
        rank,
        unit,
        trade,
        gender,
        isNafiam,
        role,
        serviceNumber,
      } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const studentExists = await Student.findOne({
          serviceNumber,
        });
        if (studentExists && studentExists.id !== studentID) {
          res.json({
            status: true,
            statusCode: 409,
            data: { id: studentExists.id, studentID },
            message: "Student exists!",
          });
        } else {
          const student = await Student.findOneAndUpdate(
            { id: studentID },
            {
              name,
              unit,
              trade,
              rank,
              role,
              serviceNumber: serviceNumber === "UNSET" ? "" : serviceNumber,
              gender,
              isNafiam,
            }
          );
          res.json({
            status: true,
            statusCode: 200,
            data: student,
            message: "Student updated",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );

  app.post("/admin/students/get", async (req, res) => {
    const { token, page, limit } = req.body;
    const { user, id } = verifyToken(token);
    if (!id || !user || user !== "admin") {
      res.json(UnauthorizedResponseObject);
    } else {
      const students = await Student.find(
        {},

        {},
        {
          skip: page === 1 ? 0 : page === 2 ? limit : (page - 1) * limit,
          limit,
        }
      ).select("-password");
      const totalCount = await Student.countDocuments({});
      res.json(<DefaultResponse>{
        status: true,
        statusCode: 200,
        data: students,
        page,
        limit,
        rows: students.length,
        total: totalCount,
      });
    }
  });
  app.post("/admin/getStudent/:studentID", async (req, res) => {
    const body: AdminAuthRequiredRequest = req.body;

    const studentID = req.params.studentID;
    const v = verifyToken(body.token);
    if (!body || !body.token || v.user !== "admin") {
      res.json(UnauthorizedResponseObject);
    } else {
      const student = await Student.findOne({ id: studentID });
      res.json(<DefaultResponse>{
        data: student,
        status: true,
        statusCode: student ? 200 : 404,
      });
    }
  });
  app.delete(
    "/admin/student/:studentID",
    validateTokenRequest,
    async (req, res) => {
      const { token } = req.body;
      const { studentID } = req.params;
      const { user, id } = verifyToken(token);
      if (!id || !user || user !== "admin") {
        res.json(UnauthorizedResponseObject);
      } else {
        const student = await Student.deleteOne({ id: studentID });
        res.json(<DefaultResponse>{
          data: student,
          status: true,
          statusCode: 204,
          message: "Student deleted!",
        });
      }
    }
  );

  //INSTRUCTORS FUNCTIONALITY
  app.post(
    `${basePath}/instructor/create`,
    validateCreateInstructor,
    async (req, res) => {
      const {
        token,
        email,
        firstName,
        lastName,
        rank,
        school,
        gender,
        role,
        serviceNumber,
      } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const instructorExists = await Instructor.findOne({
          $or: [{ email: email }, { serviceNumber }],
        });
        console.log({ ment: instructorExists });
        if (!instructorExists || serviceNumber.length === 0) {
          const saltRounds = 10;

          const salt = await bcrypt.genSalt(saltRounds);
          const hash = await bcrypt.hash(lastName.toUpperCase(), salt);
          const instructor = await new Instructor({
            id: generateRandomString(32),
            email,
            firstName,
            lastName,
            rank,
            school,
            role,
            serviceNumber: serviceNumber === "UNSET" ? "" : serviceNumber,

            gender,
            password: hash,
            dateCreated: Date.now(),
            isChangedPassword: false,
            // school,
          }).save();
          res.json({
            status: true,
            statusCode: 201,
            data: instructor,
            message: "New Instructor created",
          });
        } else {
          res.json({
            status: true,
            statusCode: 409,
            data: false,
            message: "Instructor exists!",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/instructor/update`,
    validateUpdateInstructor,
    async (req, res) => {
      const {
        instructorID,
        token,
        email,
        firstName,
        lastName,
        rank,
        school,
        gender,
        role,
        serviceNumber,
      } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const instructorExists = await Instructor.findOne({
          $or: [{ email: email }, { serviceNumber }],
        });
        if (instructorExists && instructorExists.id !== instructorID) {
          res.json({
            status: true,
            statusCode: 409,
            data: { id: instructorExists.id, instructorID },
            message: "Instructor exists!",
          });
        } else {
          const instructor = await Instructor.findOneAndUpdate(
            { id: instructorID },
            {
              email,
              firstName,
              lastName,
              rank,
              school,
              role,
              serviceNumber: serviceNumber === "UNSET" ? "" : serviceNumber,
              gender,
            }
          );
          res.json({
            status: true,
            statusCode: 200,
            data: instructor,
            message: "Instructor updated",
          });
        }
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(`${basePath}/instructor/get`, async (req, res) => {
    const { token, instructorID } = req.body;
    const { id, user } = verifyToken(token);
    if (id && user === "admin") {
      const instructor = await Instructor.findOne({ id: instructorID }).select(
        "email firstName lastName id rank gender serviceNumber role school"
      );

      res.json({
        status: true,
        statusCode: 200,
        data: instructor,
        message: "Profile successfully retrieved!",
      });
    } else {
      res.json(UnauthorizedResponseObject);
    }
  });
  app.delete(
    `${basePath}/instructor/delete`,
    validateSingleInstructorRequest,
    async (req, res) => {
      const { token, instructorID } = req.body;

      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const instructor = await Instructor.findOneAndDelete({
          id: instructorID,
        });
        res.json({
          status: true,
          statusCode: 200,
          data: instructor,
          message: "Profile successfully deleted!",
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
  app.post(
    `${basePath}/instructors/all/get`,
    validateTokenRequest,
    async (req, res) => {
      const { token } = req.body;
      const { id, user } = verifyToken(token);
      if (id && user && user === "admin") {
        const instructors = await Instructor.find({}).select(
          "email firstName lastName id rank gender role serviceNumber school"
        );
        res.json({
          status: true,
          statusCode: 200,
          data: instructors,
          message: "Instructors retrieved!",
        });
      } else {
        res.json(UnauthorizedResponseObject);
      }
    }
  );
}
