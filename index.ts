import express from "express";
import { connect } from "mongoose";

import login from "./src/routes/student/login";

import { Student, StudentProps } from "./src/models/Student";

const app = express();

const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";

connect(dbConnectString)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    login(app);
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });

export { app };
