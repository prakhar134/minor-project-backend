const axios = require('axios')
const asyncHandler = require('express-async-handler')

const newsController = {
    globalNews: asyncHandler(async (req, res) => {
        const { data } = await axios.get(`https://newsapi.org/v2/everything?q=market&apiKey=${process.env.NEWS_API_KEY}`)
        const articles = data.articles.slice(0, 12)
        res.json(articles)
    }),
    queryNews: asyncHandler(async (req, res) => {
        const { name } = req.params
        const { data } = await axios.get(`https://newsapi.org/v2/everything?q=${name}&apiKey=${process.env.NEWS_API_KEY}`)
        const articles = data.articles.slice(0, 3)
        res.json(articles)
    }),
}

module.exports = newsController