import { body } from 'express-validator';

export const updateProfileValidation = [
    body('firstName')
        .optional()
        .notEmpty().withMessage('Tên không được để trống')
        .isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự')
        .trim().escape(),

    body('lastName')
        .optional()
        .notEmpty().withMessage('Họ không được để trống')
        .isLength({ min: 2 }).withMessage('Họ phải có ít nhất 2 ký tự')
        .trim().escape(),

    body('phoneNumber')
        .optional({ checkFalsy: true }) // Cho phép rỗng
        .matches(/^(0|84)(3|5|7|8|9)([0-9]{8})$/).withMessage('Số điện thoại không đúng định dạng Việt Nam (10 số).'),

    body('address')
        .optional({ checkFalsy: true })
        .isString().withMessage('Địa chỉ phải là chuỗi văn bản')
        .trim().escape(),

    body('gender')
        .optional({ checkFalsy: true })
        .isBoolean().withMessage('Giới tính phải là true (Nam) hoặc false (Nữ)'),

    body('image')
        .optional({ checkFalsy: true })
        .isString().withMessage('Ảnh đại diện không hợp lệ')
        .trim(),

    body('bio')
        .optional({ checkFalsy: true })
        .isString().withMessage('Tiểu sử phải là chuỗi văn bản')
        .trim(),
];
