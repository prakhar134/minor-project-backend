const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    googleId: {
        type: 'String',
        required: true
    },
    coin: {
        type: Number,
        required: true,
        default: 10000
    },
    currentTrades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade'
    }],
    pastTrades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade'
    }]
})

const user = mongoose.model('User', userSchema)
module.exports = user