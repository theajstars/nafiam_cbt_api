import express from "express";
import bodyParser from "body-parser";
import { connect } from "mongoose";

import student from "./src/routes/student";

import { Student, StudentProps } from "./src/models/Student";
import admin from "./src/routes/admin";

const app = express();
app.use(bodyParser({ extended: true }));

const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";

connect(dbConnectString)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    student(app);
    admin(app);
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });

export { app };
