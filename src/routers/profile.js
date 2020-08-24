const auth = require("../middleware/auth");
const express = require("express");
const BasicProfile = require("../models/BasicProfile");
const HabitsProfile = require("../models/HabitsProfile");
const User = require("../models/User");

const router = express.Router();

router.post("/profiles/update/basic", async (req, res) => {
  // Update user profile (basic information)
  try {
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
    } = req.body; //TODO fill in the foriegn inputs

    let userProfile = await BasicProfile.findOne({ email });
    console.log(userProfile);
    if (!userProfile) {
      userProfile = new BasicProfile(req.body);
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
  //TODO: add auth
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
    } = req.body; //TODO: how to clean this up
    let userProfile = await HabitsProfile.findOne({ email });
    console.log(userProfile);
    if (userProfile) {
      await userProfile.deleteOne({ email: email });
    }
    userProfile = new HabitsProfile(req.body);
    userProfile.save();
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/profiles/:userId", async (req, res) => {
  //TODO: add auth
  // View logged in user profile
  let userId = req.params.userId;
  try {
    let userProfile = await User.findOne({ name: userId }); //TODO: change collections so only need to check habitsProfile
    let email = userProfile.email;
    console.log(email);
    let habitsProfile = await HabitsProfile.findOne({ email });
    let basicProfile = await BasicProfile.findOne({ email });
    //TODO: get other profile info
    console.log(habitsProfile);
    console.log(basicProfile);
    if (!habitsProfile && !basicProfile) {
      //TODO
    } else {
      //res.send(habitsProfile);
      res.send([habitsProfile, basicProfile]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
