/*jshint esversion:6, node: true */
'use strict';
const express = require("express");
const courseController = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const checkBoss = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');

const Course = require("../models/course");

courseController.get("/", checkTA, (req, res, next) => {
  const name = req.user.username;
  Course.find({},(err, course) => {
    if (err) return next(err);
    res.render("./course/index",{
      course,
      name
    });
  })
});

courseController.get('/new-course', (req, res, next) => {
  res.render('./course/new-course');
})

courseController.post('/new-course', checkTA, (req, res, next) => {
  const newCourse = new Course({
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: (req.body.available===true)? true : false
  })
  newCourse.save((err) => {
    if (err) return next(err);
    res.redirect('/course')
  })
});

 courseController.get('/edit/:id', checkTA, (req, res, next) => {

   const idToEdit = req.params.id;
   Course.findById(idToEdit,(err,course)=>{
     if (err) return next(err)
     else {
       res.render('./course/edit-course',{
         course
       })
     }
   })
 })

 courseController.post('/edit/:id', checkTA, (req, res, next)=>{
   const courseId = req.params.id;
   const courseModified = {
     name: req.body.name,
     startingDate: req.body.startingDate,
     endDate: req.body.endDate,
     level: req.body.level,
     available: (req.body.available===true)? true : false
   }
   Course.findByIdAndUpdate(courseId, courseModified, (err, course) => {
     if (err) return next(err)
     else {
       res.redirect('/course')
     }
   })
 })

//ojo al verbo
 courseController.post('/delete/:id', checkTA, (req, res, next) => {

   const idToDelete = req.params.id;
   Course.findByIdAndDelete(idToDelete,(err, course) => {
     if (err) return next(err);
     else {
       console.log("Exito en el delete",course);
       res.redirect('/course')
     }
   })
 })


//chequea que el usuario está autenticado (logeado) y que su role es el requerido
function checkRoles(role) {

  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      console.log("role autenticaded");
      return next();
    } else {
      res.redirect('/check');
    }
  };
}



module.exports = courseController;
