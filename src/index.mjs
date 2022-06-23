"use strict";

import express from "express";
import session from "express-session";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import auth from "./auth.mjs";
import { getGrade } from "./grade.mjs";
import sessionFileStore from "session-file-store";

// Configuration
import cred from "./credential.js";
import config from "./config.js";

const app = express();
const fileStore = sessionFileStore(session);
app.set("view engine", "pug");
app.use(morgan("combined"));
app.use(
  session({
    resave: false,
    store: new fileStore({}),
    saveUninitialized: true,
    secret: cred.SESSION_SECRET,
    name: "sessionId",
  })
);
auth.init(app);
// Production setup
app.set("trust proxy", 1); // trust first proxy
app.use(compression());
app.use(helmet());

/*
 * Setup the routes
 */
app.get("/", auth.ensure_auth, async function (req, res) {
  try {
    let grades = await getGrade(req.user.id);
    let view_params = {
      title: config.title,
      id: req.user.id,
      grades,
    };
    res.render(grades.length === 0 ? "notfound" : "grade", view_params);
  } catch (e) {
    console.log(e);
    res.status(500).send("500 Server error");
  }
});

app.use("/auth", auth.router);

app.get("*", function (req, res) {
  res.status(404).send("404");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));
