/**
 * Global Error Handler Middleware
 * Handles all errors in the application
 */

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    console.error('Error:', err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    // PostgreSQL unique violation
    if (err.code === '23505') {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // PostgreSQL foreign key violation
    if (err.code === '23503') {
        const message = 'Referenced resource not found';
        error = { message, statusCode: 400 };
    }

    // PostgreSQL not null violation
    if (err.code === '23502') {
        const message = 'Required field is missing';
        error = { message, statusCode: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
    }

    // Rate limit error
    if (err.status === 429) {
        const message = 'Too many requests, please try again later';
        error = { message, statusCode: 429 };
    }

    // Default error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    // Prepare error response
    const errorResponse = {
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    // Add request ID if available
    if (req.id) {
        errorResponse.requestId = req.id;
    }

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
