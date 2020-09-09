const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const userRelationsSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        unique: true
    },

    likedUsers: {
        type: Array
    },
    
    dislikedUsers: {
        type: Array
    },

    finalMatches: {
        type: Array
    }
})

const UserRelations = mongoose.model('UserRelations', userRelationsSchema)

module.exports = UserRelations
