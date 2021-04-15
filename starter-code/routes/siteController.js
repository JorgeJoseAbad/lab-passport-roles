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
  res.render("index",{
    fakeRoute: "/",
    user : "undefined"
  });
});

siteController.get("/login",(req,res,next)=>{
  res.render("login");
});

siteController.post("/login",
    passport.authenticate('local', {
        successRedirect: '/check',
        failureRedirect: '/login'
    }));

siteController.get("/", ensureAuthenticated, (req, res, next) => {
    User.find({}, (err, docs) => {
      debugger;
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



siteController.get('/check', checkRoles('Developer'), (req, res) => {
  console.log("in /check");
  res.render('index', {
    fakeRoute: "/check",
    user: req.user
  });
});

siteController.get('/newEmployee', checkRoles('Boss'),(req, res) => {
  console.log("in /newEmployee");
  res.render('./employees/new',{
    fakeRoute: "/newEmployee",
    user: req.user
  })
})

//añado passport autenticate como middleware en la route
siteController.post('/newEmployee', checkRoles('Boss'), passport.authenticate('local-signup',  {
  successRedirect : '/',
  failureRedirect : '/login'
}))

siteController.get('/removeEmployee', checkRoles('Boss'),(req, res) => {
  console.log("in /removeEmployee");
  res.render('./employees/listemployees',{
    fakeRoute: "/removeEmployee",
    user: req.user
  })
})

//chequea que el usuario está autenticado (logeado) y que su role es el requerido
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
