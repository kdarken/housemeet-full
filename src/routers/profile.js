const auth = require("../middleware/auth");
const express = require("express");
const BasicProfile = require("../models/BasicProfile");
const HabitsProfile = require("../models/HabitsProfile");
const User = require("../models/User");
const UserRelations = require("../models/UserRelations");
var ObjectID = require('mongodb').ObjectID;

const router = express.Router();

router.post("/profiles/update/basic", async (req, res) => {
  // Update user profile (basic information)
  try {
    const {
      userId,
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
    let userProfile = await BasicProfile.findOne({ userId });
    if (userProfile) {
      await userProfile.deleteOne({ userId: userId });
    }
    userProfile = new BasicProfile(req.body);
    console.log(userProfile);
    userProfile.save();
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
    const {
      userId,
      email,
      cleanScore,
      cleanScore2,
      guestScore,
      guestScore2,
      alcoholScore,
      alcoholScore2,
    } = req.body; //TODO: how to clean this up
    let userProfile = await HabitsProfile.findOne({ userId });
    if (userProfile) {
      await userProfile.deleteOne({ userId: userId });
    }
    userProfile = new HabitsProfile(req.body);
    console.log(userProfile);
    userProfile.save();
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/profiles/:userId", async (req, res) => { //TODO: add auth //TODO: change URL 
  // View user habits profile
  // beware of users only filling out one profile (or neither) and sending nulls over? or will this just error
  let userId = req.params.userId
  try {
    let habitsProfile = await HabitsProfile.findOne({ userId });
    let basicProfile = await BasicProfile.findOne({ userId });
    //TODO: get other profile info
    console.log(habitsProfile);
    console.log(basicProfile);
    if (!habitsProfile && !basicProfile) {
      //TODO
    } else {
      res.send([habitsProfile, basicProfile]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/profiles/matches/:userId", async (req, res) => { //TODO: add auth
  // View potential matches for user
  console.log("about to send potential matches")
  let userId = req.params.userId
  try {
    let currUserInfo = await BasicProfile.findOne({ userId })
    let currUserPref = await HabitsProfile.findOne({ userId })
    let currUserRelations = await UserRelations.findOne({ userId }) //what if this is null
    if (!currUserInfo || !currUserPref) { //this will fail if user hasn't finished filling out both forms
      //TODO
    } else {
      let users = await BasicProfile.distinct("userId", 
        {
          userId: {$ne : userId, $nin: currUserRelations.likedUsers.concat(currUserRelations.dislikedUsers, currUserRelations.finalMatches)}, 
          newCity: {$eq: currUserInfo.newCity},
      });
      console.log(users)
      let agg = await HabitsProfile.aggregate([
        {$match: {userId: {$ne: userId},
                  userId: {$in: users},
                
                  
                }},
        {$project: {userId: "$userId",
                    email: "$email", 
                    cleanScore: "$cleanScore", 
                    guestScore: "$guestScore",  
                    alcoholScore: "$alcoholScore",
                    diff: { $add: [  { $abs: { $subtract: [ "$cleanScore", currUserPref.cleanScore2 ] } }, 
                                     { $abs: { $subtract: [ "$guestScore", currUserPref.guestScore2 ] } }, 
                                     { $abs: { $subtract: [ "$alcoholScore", currUserPref.alcoholScore2 ] } } ] }}},
        {$sort: {diff: 1}}]).limit(4);
      //console.log(agg.map(function(el) { return el.email }))
      res.send(agg.map(function(el) { return el.userId }))
    }
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
});

module.exports = router
