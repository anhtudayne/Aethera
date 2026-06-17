import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 401,
            message: 'Không tìm thấy token xác thực hoặc token không hợp lệ.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, ... }
        next();
    } catch (error) {
        return res.status(403).json({
            status: 403,
            message: 'Token không hợp lệ hoặc đã hết hạn.',
        });
    }
};

export const verifyAdmin = (req, res, next) => {
    // req.user được gán từ verifyToken — JWT payload chứa { id, role, email }
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            status: 403,
            message: 'Không có quyền truy cập. Yêu cầu quyền quản trị.',
        });
    }
};
