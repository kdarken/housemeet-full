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
      moveInDay,
      numberInHome,
      preferredNeighborhood,
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

<<<<<<< HEAD
router.get("/profiles/:userId", async (req, res) => { //TODO: add auth
  // View logged in user habits profile
  let userId = req.params.userId
=======
router.get("/profiles/:userId", async (req, res) => {
  //TODO: add auth
  // View logged in user profile
  let userId = req.params.userId;
>>>>>>> origin/socials
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

router.get("/profiles/email/:email", async (req, res) => { //TODO: use modified /profiles/:userId method instead once we stop iding users by email 
  // View logged in user basic profile
  let email = req.params.email + "@gmail.com"
  console.log(email)
  try {
    let userProfile = await BasicProfile.findOne({ email }) //TODO: change collections so only need to check habitsProfile
    //TODO: get other profile info
    console.log(userProfile)
    if (!userProfile) {
      //TODO
    } else {
      res.send(userProfile)
    }
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
});

router.get("/profiles/matches/:userId", async (req, res) => { //TODO: add auth
  // View potential matches for user
  console.log("about to send potential matches")
  let userId = req.params.userId
  try {
    let userProfile = await User.findOne({ name: userId }) //TODO: change collections so only need to check habitsProfile
    let userEmail = userProfile.email
    let currUserInfo = await BasicProfile.findOne({ 'email' : userEmail })
    let currUserPref = await HabitsProfile.findOne({ 'email' : userEmail })
    if (!currUserInfo || !currUserPref) { //this will fail if user hasn't finished filling out both forms
      //TODO
    } else {
      let users = await BasicProfile.distinct("email", 
        {email: {$ne : userEmail}, 
        newCity: {$eq: currUserInfo.newCity}});
      let agg = await HabitsProfile.aggregate([
        {$match: {email: {$ne: userEmail},
                  email: {$in: users}}},
        {$project: {email: "$email", 
                    cleanScore: "$cleanScore", 
                    guestScore: "$guestScore",  
                    alcoholScore: "$alcoholScore",
                    diff: { $add: [  { $abs: { $subtract: [ "$cleanScore", currUserPref.cleanScore2 ] } }, 
                                     { $abs: { $subtract: [ "$guestScore", currUserPref.guestScore2 ] } }, 
                                     { $abs: { $subtract: [ "$alcoholScore", currUserPref.alcoholScore2 ] } } ] }}},
        {$sort: {diff: 1}}]).limit(4);
      //console.log(agg.map(function(el) { return el.email }))
      res.send(agg.map(function(el) { return el.email }))
    }
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
});

module.exports = router
