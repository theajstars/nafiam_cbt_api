import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "mongoose";
import bcrypt from "bcryptjs";

import admin from "./src/routes/admin";
import student from "./src/routes/student";
import lecturer from "./src/routes/lecturer";
import examination from "./src/routes/examination";
import course from "./src/routes/course";
import { Lecturer } from "./src/models/Lecturer";
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

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser({ extended: true }));

const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";
// const dbConnectString =
//   "mongodb+srv://theajstars:XS4582oDGlvmhAub@data.hy4gux2.mongodb.net/?retryWrites=true&w=majority&appName=data/nafiamDB";

connect(dbConnectString)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    student(app);
    misc(app);
    admin(app);
    lecturer(app);
    examination(app);
    course(app);
    file(app);
    school(app);
    result(app);
    log(app);
    lecture(app);
    practice(app);
    async function createAdmin() {
      const hash = await genPassword("securePassword2024");
      new Admin({
        id: generateRandomString(32),
        firstName: "Zeus",
        lastName: "Olympus",
        email: "me@theajstars.com",
        serviceNumber: "NAF01/12345",
        rank: "Air Chief Marshal",
        dateCreated: Date.now(),
        password: hash,
        isChangedPassword: true,
        superUser: true,
      }).save();
    }

    // genPassword("AJIBOYE");
    // createAdmin();
    // Course.updateMany({}, { lecturerID: "1709114865502" }).exec();
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    app.listen(PORT, () =>
      console.log(`Server running without DB on port: ${PORT}`)
    );
  });

export { app };
