"use strict";

import express from "express";
import session from "express-session";
import morgan from "morgan";
import cred from "./credential.js";
import auth from "./auth.mjs";
import { getGrade } from "./grade.mjs";
import sessionFileStore from "session-file-store";

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
  })
);
auth.init(app);

/*
 * Setup the routes
 */
app.get("/", auth.ensure_auth, async function (req, res) {
  try {
    let grades = await getGrade(req.user.id);
    let view_params = {
      title: "CSC061",
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));
