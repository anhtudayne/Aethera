export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 403,
                message: 'Bạn không có quyền thực hiện hành động này.',
            });
        }
        next();
    };
};
