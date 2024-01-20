import express from "express";
import { connect } from "mongoose";

import { Student } from "./src/models/Student";

const app = express();

connect("mongodb://127.0.0.1:27017/nafiam_cbt")
  .then(() => {
    const student = new Student({
      firstName: "Lord",
      lastName: "Braavosi",
      email: "atajiboyeo@gmail.coms",
    });
    student.save();
    app.listen(8080, () => console.log("Server started!"));
    app.get("/create", () => {});
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
