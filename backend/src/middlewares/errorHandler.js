// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    // Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            status: 400,
            message: 'Validation Error',
            errors: err.errors.map(e => ({ field: e.path, message: e.message })),
        });
    }
    
    // Sequelize unique constraint
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            status: 409,
            message: 'Dữ liệu đã tồn tại',
            errors: err.errors.map(e => ({ field: e.path, message: e.message })),
        });
    }
    
    return res.status(statusCode).json({
        status: statusCode,
        message,
    });
};

export default errorHandler;
