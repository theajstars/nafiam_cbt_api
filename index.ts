import dotenv from "dotenv";

dotenv.config();
import express from "express";
import { connect } from "mongoose";

import { Student } from "./src/models/Student";

const app = express();
const PORT = 8080;
const dbConnectString = "mongodb://127.0.0.1:27017/nafiam_cbt";

console.log(process.env.PORT);
connect(dbConnectString)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    app.get("/", async (req, res) => {
      res.json({
        status: true,
        message: "Connected Successfully!",
      });
    });
    app.get("/create", async (req, res) => {
      const student = new Student({
        firstName: "Lord",
        lastName: "Braavosi",
        email: "me@theajstars.com",
      });
      res.json({
        data: await Student.find(),
      });
      // return await student.save();
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
