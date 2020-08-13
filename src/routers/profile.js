const auth = require("../middleware/auth");
const express = require("express");
const BasicProfile = require("../models/BasicProfile");
const HabitsProfile = require("../models/HabitsProfile");
var fs = require("fs");
var path = require("path");

const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.fieldname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

router.post("/profiles/update/basic", async (req, res) => {
  // Update user profile (basic information)
  try {
    console.log(req.body);

    var obj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      lifeStyle: req.body.lifeStyle,
      roommateOrHousemate: req.body.roommateOrHousemate,
      bio: req.body.bio,
      currentCity: req.body.currentCity,
      budget: req.body.budget,
      email: req.body.email,
      profilePhoto: {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    };

    const {
      firstName,
      lastName,
      dateOfBirth,
      lifeStyle,
      roommateOrHousemate,
      bio,
      currentCity,
      newCity,
      budget,
      email,
      profilePhoto,
    } = req.body; //TODO fill in the foriegn inputs

    let userProfile = await BasicProfile.findOne({ email: req.body.email });
    console.log(userProfile);
    if (!userProfile) {
      userProfile = new BasicProfile(obj);
      userProfile.save();
    } else {
      //TODO
    }
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/profiles/update/habits", async (req, res) => {
  //TODO: add auth, get auth to work
  // Update user profile (living habits)
  try {
    console.log(req.body);
    const {
      email,
      cleanScore,
      cleanScore2,
      guestScore,
      guestScore2,
      alcoholScore,
      alcoholScore2,
    } = req.body; //TODO; how to clean this up
    let userProfile = await HabitsProfile.findOne({ email });
    console.log(userProfile);
    if (!userProfile) {
      userProfile = new HabitsProfile(req.body);
      userProfile.save();
    } else {
      //TODO
    }
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/profiles/me", auth, async (req, res) => {
  // View logged in user profile
  res.send(req.user);
});

module.exports = router;
