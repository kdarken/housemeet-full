const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const basicProfileSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
    trim: true,
  },
  lifeStyle: {
    type: String,
    required: true,
    trim: true,
  },
  roommateOrHousemate: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    required: true,
    trim: true,
  },
  currentCity: {
    type: String,
    required: true,
    trim: true,
  },
  newCity: {
    type: String,
    required: true,
    trim: true,
  },
  budget: {
    type: Number,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  profilePhoto: {
    data: Buffer,
    contentType: String,
  },
});

const BasicProfile = mongoose.model("BasicProfile", basicProfileSchema);

module.exports = BasicProfile;
