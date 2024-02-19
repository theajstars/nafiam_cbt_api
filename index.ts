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
    const genPassword = async () => {
      const saltRounds = 10;

      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash("securePassword2024", salt, function (err, hash) {
          console.log(hash);
        });
      });
    };
    genPassword();
    // new Lecturer({
    //   id: Date.now().toString(),
    //   firstName: "Lord",
    //   lastName: "Braavosi",
    //   email: "me@theajstars.com",
    //   password: "$2a$10$l.V0HzLVySU5s2MOOZ4PWuydU5MFxIuNmV.CP.Bll2iNx0Ml7lD9S",
    //   rank: "Air Vice Marshal",
    // }).save();
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });

export { app };
