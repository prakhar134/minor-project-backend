const asyncHandler = require('express-async-handler')
const User = require('../models/user')

const userController = {
    register: asyncHandler(async (req, res) => {
        const user = await User.findOne({ googleId: req.user })
        if (!user) {
            const created = new User({ googleId: req.user })
            await created.save()
            res.json(created)
        }
        else
            res.json(user)            
    }),
    currentPosition: asyncHandler (async(req, res) => {
        const { currentTrades } = await User.findOne({ googleId: req.user }).populate('currentTrades', 'stockName buy')
        if (currentTrades.length === 0)
            throw new Error("No currrent trades")
        res.json(currentTrades)
    }),
    pastPosition: asyncHandler (async(req, res) => {
        const { pastTrades } = await User.findOne({ googleId: req.user }).populate('pastTrades', 'stockName sell')
        if (pastTrades.length === 0)
            throw new Error("No Past trades")
        res.json(pastTrades)
    }),
}

module.exports = userController