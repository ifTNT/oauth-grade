"use strict";

import express from "express";
import session from "express-session";
import morgan from "morgan";
import cred from "./credential.js";
import auth from "./auth.mjs";
import sessionFileStore from "session-file-store";

const app = express();
const FileStore = sessionFileStore(session);
app.set("view engine", "ejs");
app.use(morgan("combined"));

app.use(
  session({
    resave: false,
    store: new FileStore({}),
    saveUninitialized: true,
    secret: cred.SESSION_SECRET,
  })
);
auth.init(app);

app.get("/", auth.ensure_auth, function (req, res) {
  res.json(req.user);
});

app.use("/auth", auth.router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));
