"use strict";

import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import cred from "./credential.js";
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/error",
    successRedirect: "/",
  })
);

router.get("/error", function (req, res) {
  res.send("Error");
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function auth_user(access_token, refresh_token, profile, done) {
  console.log(profile);
  return done(null, {
    provider: profile.provider,
    email: profile.email,
    id: profile.email.split("@")[0].toUpperCase(),
    sub: profile.sub,
    access_token,
    refresh_token,
  });
}

function init(app) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: cred.GOOGLE_CLIENT_ID,
        clientSecret: cred.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      auth_user
    )
  );

  // Store the user object to session
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  app.use(passport.initialize());
  app.use(passport.session());
}

function ensure_auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/google");
}

export default {
  init,
  ensure_auth,
  router,
};
