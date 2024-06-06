import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "mongoose";
import bcrypt from "bcryptjs";

import routes from "./src/routes/routes";

import { genPassword } from "./src/Lib/Methods";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser({ extended: true }));

const PORT = 8080;

const dbConnectString =
  "mongodb+srv://theajstars:dGF9caF4b8PlrLtP@data.hy4gux2.mongodb.net/?retryWrites=true&w=majority&appName=data/nafiamDB";

connect(dbConnectString)
  .then(() => {
    routes(app);
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    app.listen(PORT, () =>
      console.log(`Server running without DB on port: ${PORT}`)
    );
  });

export { app };
