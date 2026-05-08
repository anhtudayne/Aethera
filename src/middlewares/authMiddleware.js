export const verifyToken = (req, res, next) => {
    // Tạm thời giả lập là đã đăng nhập thành công với ID = 1
    // TODO: Thay thế bằng logic giải mã JWT thực tế khi tính năng Login hoàn thiện
    req.user = { id: 1, role: 'user' }; 
    next(); 
};
