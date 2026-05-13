// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Lỗi server nội bộ';

    res.status(statusCode).json({
        status: statusCode,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
