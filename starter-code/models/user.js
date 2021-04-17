/*jshint esversion:6*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true},
  name:  {type: String, required: true},
  email: {type: String, required: true},
  familyName: {type: String, required: true},
  password: {type: String, required: true},
  role: {
    type : String,
    enum : ['Boss', 'Developer', 'TA', 'Student'],
    default : 'Boss'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
