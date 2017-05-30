/*jshint esversion:6*/
const users = [
  {
    name:  'General Manager',
    email: 'GM@ironhack.com',
    role:  'Boss'
  },
];

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ibi-ironhack');
const User = require('../models/user');


Product.create(users, (err, docs) => {
  if (err) { throw err; }
  docs.forEach( (User) => {
    console.log(User.name);
  });
  mongoose.connection.close();
});
