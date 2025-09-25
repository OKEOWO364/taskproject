/**
 * 404 Not Found Middleware
 * Handles requests to non-existent routes
 */

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = notFound;
