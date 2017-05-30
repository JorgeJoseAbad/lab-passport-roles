/*jshint esversion:6, node: true */
'use strict';
const express = require("express");
const siteController = express.Router();

siteController.get("/", (req, res, next) => {
  res.render("index");
});


function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/index');
    }
  };
}

siteController.get('/', checkRoles('Boss'), (req, res) => {
  res.render('index', {user: req.user});
});



module.exports = siteController;
