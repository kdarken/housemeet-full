const auth = require("../middleware/auth");
const express = require("express");
const BasicProfile = require("../models/BasicProfile");
const HabitsProfile = require("../models/HabitsProfile");

const router = express.Router();

router.post("/profiles/update/basic", async (req, res) => {
  // Update user profile (basic information)
  try {
    console.log(req.body);

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


router.post("/profiles/update/habits", auth, async (req, res) => {
  // Update user profile (living habits)
  try {
    console.log(req.body);
    const { email, otherInfo } = req.body; //TODO
    const userProfile = db.user - habits - profiles.find({ email: email });
    if (!userProfile) {
      userProfile = new HabitsProfile(req.body);
      //await userProfile.save()
    } else {
      //TODO
router.post('/profiles/update/habits', async(req, res) => { //TODO: add auth, get auth to work
    // Update user profile (living habits)
    try {
        console.log(req.body);
        const { email, cleanScore, cleanScore2, guestScore, guestScore2, alcoholScore, alcoholScore2 } = req.body //TODO; how to clean this up
        let userProfile = await HabitsProfile.findOne({ email })
        console.log(userProfile)
        if (!userProfile) {
            userProfile = new HabitsProfile(req.body)
            userProfile.save()
        } else {
           //TODO
        }
        res.status(201).send()
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
    
});

router.get("/profiles/me", auth, async (req, res) => {
  // View logged in user profile
  res.send(req.user);
});

module.exports = router;
