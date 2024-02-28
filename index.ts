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
import { generateRandomString } from "./src/Lib/Methods";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser({ extended: true }));

const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";

connect(dbConnectString)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    student(app);
    admin(app);
    lecturer(app);
    examination(app);
    course(app);
    file(app);
    const genPassword = async () => {
      const saltRounds = 10;

      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash("securePassword2024", salt, function (err, hash) {
          console.log(hash);
          // new Admin({
          //   id: generateRandomString(32),
          //   firstName: "Zeus",
          //   lastName: "Olympus",
          //   email: "me@theajstars.com",
          //   password: hash,
          // }).save();
        });
      });
    };
    genPassword();
    // Course.updateMany({}, { lecturerID: "1709114865502" }).exec();
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });

export { app };
