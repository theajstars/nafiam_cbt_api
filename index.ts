import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "mongoose";
import bcrypt from "bcryptjs";

import admin from "./src/routes/admin";
import student from "./src/routes/student";
import instructor from "./src/routes/instructor";
import examination from "./src/routes/examination";
import course from "./src/routes/course";
import { Instructor } from "./src/models/Instructor";
import file from "./src/routes/file";
import { Examination } from "./src/models/Examination";
import { Course } from "./src/models/Course";
import { Admin } from "./src/models/Admin";
import { genPassword, generateRandomString } from "./src/Lib/Methods";
import misc from "./src/routes/misc";
import school from "./src/routes/school";
import result from "./src/routes/result";
import log from "./src/routes/log";
import lecture from "./src/routes/lecture";
import practice from "./src/routes/practice";
import { Student } from "./src/models/Student";
import { year } from "./src/Lib/Data";
import { logger } from "./src/middleware/logger";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser({ extended: true }));
// app.use(logger);
const PORT = 8080;
// const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";
const dbConnectString =
  "mongodb+srv://theajstars:dGF9caF4b8PlrLtP@data.hy4gux2.mongodb.net/?retryWrites=true&w=majority&appName=data/nafiamDB";

connect(dbConnectString)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    student(app);
    misc(app);
    admin(app);
    instructor(app);
    examination(app);
    course(app);
    file(app);
    school(app);
    result(app);
    log(app);
    lecture(app);
    practice(app);

    // async function blue() {
    //   await Student.updateMany(
    //     {},
    //     { password: await genPassword("NAFIAM2024") }
    //   );
    //   console.log("Done!");
    // }
    // blue();
    async function createAdmin() {
      const hash = await genPassword(`NAFIAM${year}`);
      const admin = await new Admin({
        id: generateRandomString(32),
        name: "Zeus of Olympus",

        serviceNumber: "NAF01/12345",
        rank: "Air Chief Marshal",
        dateCreated: Date.now(),
        password: hash,
        isChangedPassword: true,
        superUser: true,
      }).save();
    }
    async function changeAdminPassword() {
      const hash = await genPassword("NAFIAM2024");
      await Admin.updateMany({}, { password: hash });
      console.log("Password has been changed!");
    }

    async function DoSomething() {
      await Examination.updateMany({}, { published: false });
    }
    // DoSomething();

    // changeAdminPassword();

    // createAdmin();
    // Course.updateMany({}, { instructorID: "1709114865502" }).exec();
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    app.listen(PORT, () =>
      console.log(`Server running without DB on port: ${PORT}`)
    );
  });
// genPassword("NAFIAM2024").then((r) => console.log(r));

export { app };
