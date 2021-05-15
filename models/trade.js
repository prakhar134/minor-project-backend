const mongoose = require('mongoose')

const details = {
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    transaction: {
        type: Number,
        required: true  
    },
    threshold: {
        type: Number,
        default: null
    }
}

const tradeSchema = new mongoose.Schema({
    stockName: {
        type: String,
        required: true
    },
    trade: {
        type: String,
        required: true
    },
    buy: [details],
    sell: [details],
    user: {
        type: String,
        ref: 'User',
        required: true
    }
})

const trade = mongoose.model('Trade', tradeSchema)
module.exports = trade