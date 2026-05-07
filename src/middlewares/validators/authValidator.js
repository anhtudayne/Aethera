import { body, validationResult } from 'express-validator';

// Validation rules for Register
export const registerValidation = [
    body('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/\d/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ số')
        .matches(/[a-zA-Z]/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ cái'),

    body('firstName')
        .notEmpty().withMessage('Tên không được để trống')
        .isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự')
        .trim().escape(),

    body('lastName')
        .notEmpty().withMessage('Họ không được để trống')
        .isLength({ min: 2 }).withMessage('Họ phải có ít nhất 2 ký tự')
        .trim().escape(),

    body('phoneNumber')
        .optional()
        .isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),

    body('gender')
        .optional()
        .isBoolean().withMessage('Giới tính phải là true hoặc false'),
];

// Handle validation results
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: 'Dữ liệu không hợp lệ',
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};
