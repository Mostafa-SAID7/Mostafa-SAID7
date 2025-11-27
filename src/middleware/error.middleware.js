/**
 * Error handling middleware
 * Catches and formats errors for API responses
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error(err.stack);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: 'Route not found',
            path: req.originalUrl,
        },
    });
};

module.exports = { errorHandler, notFound };
