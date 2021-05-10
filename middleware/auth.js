const asyncHandler = require('express-async-handler')

const auth = asyncHandler (async (req, res, next) => {
    const googleId = req.header('x-auth-token')

    if (!googleId)
        throw new Error('Unauthorized access')
    try {
        req.user = googleId
        next()
    }
    catch (e) {
        console.log(e)
        throw new Error('You had been looged out. Please log in')
    }
})

module.exports = auth