const auth = require('../middleware/auth')
const express = require('express')
const User = require('../models/User')
const UserRelations = require('../models/UserRelations')
var ObjectID = require('mongodb').ObjectID;

const router = express.Router()

router.post('/users/signup', async (req, res) => {
    // Create a new user
    try {
        console.log(req.body);
        req.body.userId = new ObjectID();
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        console.log("error")
        res.status(400).send(error)
    }
})

router.post('/users/login', async(req, res) => {
    // Login a registered user
    try {
        console.log(req.body);
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})

router.post('/users/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/:userId/likes', async (req, res) => {
    // Add a user to liked users
    try {
        const {
            likedUserId
          } = req.body;
        let currUserId = req.params.userId
        let currUserRelations = await UserRelations.findOne({ userId: currUserId })
        if (!currUserRelations) {
            console.log("need to make new userRelations doc")
            currUserRelations = new UserRelations({
                userId: currUserId,
                likedUsers: [ObjectID(likedUserId)],
                dislikedUsers: [],
                finalMatches: []
            })
            await currUserRelations.save()
        } else {
            await UserRelations.updateOne(
                { userId: currUserId },
                { $addToSet: { likedUsers: ObjectID(likedUserId) } }
            )
        }
        /** If liked user has also liked curr user back, we have a match and must update both users' final matches */
        let likedUserRelations = await UserRelations.findOne({ userId: likedUserId })
        if (likedUserRelations && likedUserRelations.likedUsers.includes(currUserId)) {
            await UserRelations.updateOne(
                { userId: currUserId },
                { $addToSet: { finalMatches: ObjectID(likedUserId) } }
            )
            await UserRelations.updateOne(
                { userId: likedUserId },
                { $addToSet: { finalMatches: ObjectID(currUserId) } }
            )
            console.log("updated user matches")
        }
        console.log("updated user likes")
        res.status(201).send()
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.post('/users/:userId/dislikes', async (req, res) => {
    // Add a user to disliked users
    try {
        const {
            dislikedUserId
          } = req.body;
        let currUserId = req.params.userId
        let currUserRelations = await UserRelations.findOne({ userId: currUserId })
        if (!currUserRelations) {
            console.log("need to make new userRelations doc")
            currUserRelations = new UserRelations({
                userId: currUserId,
                likedUsers: [],
                dislikedUsers: [ObjectID(dislikedUserId)],
                finalMatches: []
            })
            await currUserRelations.save()
        } else {
            await UserRelations.updateOne(
                { userId: currUserId },
                { $addToSet: { dislikedUsers: ObjectID(dislikedUserId) } }
            )
        }
        console.log("updated user dislikes")
        res.status(201).send()
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

module.exports = router
