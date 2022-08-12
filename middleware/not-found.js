const notFoundMiddleware = (req, res) => res.status(404).json('Route does not exist')

export default notFoundMiddleware