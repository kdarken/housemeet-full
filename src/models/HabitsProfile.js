const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = require('mongodb')

const habitsProfileSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },

    cleanScore: {
        type: Number,
        required: true
    },
    
    cleanScore2: {
        type: Number,
        required: true
    },

    guestScore: {
        type: Number,
        required: true
    },

    guestScore2: {
        type: Number,
        required: true
    },

    alcoholScore: {
        type: Number,
        required: true
    },

    alcoholScore2: {
        type: Number,
        required: true
    }
})

const HabitsProfile = mongoose.model('HabitsProfile', habitsProfileSchema)

module.exports = HabitsProfile
