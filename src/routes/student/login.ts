// import { app } from "../..";
import { Express } from "express";
export default function (app: Express) {
  app.get("/", async (req, res) => {
    res.json({
      status: true,
      message: "Connected Successfully!",
    });
  });
}
