/*jshint esversion:6, node: true */
'use strict';
const express = require("express");
const siteController = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const checkBoss = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');

const User = require("../models/user");

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login",(req,res,next)=>{
  res.render("login");
});

siteController.post("/login",
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

siteController.get("/", ensureAuthenticated, (req, res, next) => {
    User.find({}, (err, docs) => {
        if (err) return next(err);
        let renderObj = {isBoss: false, userId: req.user.id, users: docs};
        if (req.user.role === 'Boss') {
            renderObj.isBoss = true;
        }
        res.render("index", renderObj);
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("function ensureAuthenticated");
        return next();
    } else {
        res.redirect('/login');
    }
}

//checkRoles



siteController.get('/check', checkRoles('Boss'), (req, res) => {
  console.log("in /check");
  res.render('index', {user: req.user});
});

function checkRoles(role) {
  console.log("in function ckeckRoles");
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      console.log("role autenticaded");
      return next();
    } else {
      res.redirect('/index');
    }
  };
}



module.exports = siteController;
