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
  });
});

siteController.get("/login",(req,res,next)=>{
  res.render("login");
});

siteController.post("/login",
    passport.authenticate('local', {
        successRedirect: '/users',
        failureRedirect: '/login'
    }));

siteController.get("/users", ensureAuthenticated, (req, res, next) => {
    User.find({}, (err, docs) => {
        if (err) return next(err);
        let renderObj = {isBoss: false, userId: req.user.id, users: docs};
        if (req.user.role === 'Boss') {
            renderObj.isBoss = true;
        }
        res.render("./employees/users",{
          renderObj,
          user: req.user,
          fakeRoute: "/users"
        }
      );
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


//cambiar esto para redirigir según roles
siteController.get('/check', checkDeveloper, (req, res) => {
  console.log("in /check");


  res.redirect('/users')
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


/*Rutas para ver perfiles, y Edicion de los mismos perfiles*/
siteController.get('/profile/:id', (req, res) => {
  const userId = req.params.id;

  User.findById(userId,(err, user) => {
    if (err) return next(err)
    let editable = false;
    if(userId === req.user.id) {
      editable = true;
    }
    res.render('./employees/showuser',{
      user,
      editable
    })
  })
})

siteController.get('/edit/:id',(req, res) => {

  const userId = req.params.id;
  User.findById(userId,(err, user) => {
    if (err) return next(err)
    let editable = false;
    if(userId === req.user.id) {
      editable = true;
    }
    res.render('./employees/edit',{
      user,
      editable
    })
  })

})

siteController.post('/edit/:id',(req, res) => {

  const userId=req.params.id
  const userModified = {
    email: req.body.email,
    familyName: req.body.familyName,
    name: req.body.name,
  }

  User.findByIdAndUpdate(userId,userModified,{new:true},(err, user) => {
    if (err) return next(err);
    res.render('./employees/showuser',{
      user,
      editable:false //para no repetir directamente
    })
  })

})


//chequea que el usuario está autenticado (logeado) y que su role es el requerido
function checkRoles(role) {
  console.log("in function ckeckRoles");
  return function(req, res, next) {
    debugger;
    if (req.isAuthenticated() && req.user.role === role) {
      console.log("role autenticaded");
      return next();
    } else {
      res.redirect('/index');
    }
  };
}



module.exports = siteController;
