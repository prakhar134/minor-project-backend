const errorHandler = {
    notFound: (req, res, next) => {
        const error = new Error(`${req.originalUrl} not Found`)
        next(error)
    },
    otherError: (err, req, res, next) => {
        const statusCode = res.statusCode === 200 ? 400 : res.statusCode
        res.status(statusCode)
        res.json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        })
    }
}

module.exports = errorHandler