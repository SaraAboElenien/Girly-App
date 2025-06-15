export const asyncHandler = (handle) => {
    return (req, res, next) => {
        handle(req, res, next).catch((err) => {
            next(err)
        })
    }
}



export const globleErrorHandling = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: "error", err: err.message });
    next()
} 