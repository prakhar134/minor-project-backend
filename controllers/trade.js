const asyncHandler = require('express-async-handler')
const Trade = require('../models/trade')
const User = require('../models/user')

const tradeController = {
    buyStock: asyncHandler(async (req, res) => {
        let { stockName, quantity, buyPrice } = req.body
        quantity = parseFloat(quantity)
        buyPrice = parseFloat(buyPrice)
        const transaction = parseFloat((quantity * buyPrice).toFixed(2))
        const detail = {
            price: buyPrice,
            quantity,
            transaction
        }
        const user = await User.findOne({ googleId: req.user }).populate('currentTrades', 'stockName _id')
        if (user.coin < transaction)
            throw new Error("Not enough coin")
        let trade = user.currentTrades.filter((trade) => trade.stockName === stockName)
        if (trade.length === 0) {
            const newTrade = new Trade({ stockName, trade: 'buy', buy: detail, user: req.user })
            await newTrade.save()
            user.currentTrades = [...user.currentTrades, newTrade._id]
            res.json(newTrade)
        }
        else {
            const position = await Trade.findById(trade[0]._id)
            const samePriceTrade = position.buy.filter(t => t.price === buyPrice)
            if (samePriceTrade.length === 0)
                position.buy = [...position.buy, detail]
            else {
                position.buy.forEach(t => {
                    if (t.price === buyPrice) {
                        t.quantity = t.quantity + quantity
                        t.transaction = t.transaction + transaction
                    }
                })
            }
            await position.save()
            res.json(position)
        }
        user.coin = user.coin - transaction
        await user.save()
    }),
    sellStock: asyncHandler(async (req, res) => {
        let { stockName, quantity, buyPrice, sellPrice } = req.body
        quantity = parseInt(quantity)
        buyPrice = parseFloat(buyPrice)
        sellPrice = parseFloat(sellPrice)
        const transaction = parseFloat((quantity * sellPrice).toFixed(2))
        const user = await User.findOne({ googleId: req.user }).populate('currentTrades', '_id stockName buy')
        let trade = user.currentTrades.filter(trade => trade.stockName === stockName)
        if (trade.length === 0)
            throw new Error("You dont have this stock")
        const position = await Trade.findById(trade[0]._id)
        if (position.buy.length === 0)
            throw new Error("You dont have this stock")
        let done
        let presence = true
        position.buy.forEach(t => {
            if (buyPrice === t.price && quantity === t.quantity) {
                done = t
                presence = false
                user.coin = user.coin + transaction
            }
            else if (buyPrice === t.price && quantity < t.quantity) {
                presence = false
                t.quantity = t.quantity - quantity
                user.coin = user.coin + transaction
            }
            else if (buyPrice === t.price && quantity > t.quantity) {
                throw new Error("Not enough stock")
            }
        })
        if (presence)
            throw new Error("Enter valid stock price")
        if (done)
            position.buy = position.buy.filter(t2 => t2 !== done)
        const details = {
            price: sellPrice,
            quantity,
            transaction
        }
        await position.save()
        const sold = await Trade.findOne({ stockName, trade: 'sell' })
        if(!sold){
            const newTrade = new Trade({
                stockName,
                trade: 'sell',
                sell: details,
                user: req.user
            })
            await newTrade.save()
            user.pastTrades = [...user.pastTrades, newTrade]
            res.json(newTrade)
        }
        else {
            sold.sell = [...sold.sell, details]
            await sold.save()
            res.json(sold)
        }
        const ifEmpty = await Trade.findOneAndDelete({ buy: [], trade: 'buy' })
        if (ifEmpty) 
            user.currentTrades = user.currentTrades.filter(trade => trade._id !== ifEmpty._id)
        await user.save()
    }),
    getTrade: asyncHandler(async (req, res) => {
        const { id } = req.params
        const trade = await Trade.findById(id)
        if (!trade)
            throw new Error("No Trade Found")
        res.json(trade)
    })
}

module.exports = tradeController