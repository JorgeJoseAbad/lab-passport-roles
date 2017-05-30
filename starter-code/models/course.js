/*jshint esversion:6 */
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const courseSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    startingDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    level: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      required: true
   }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
