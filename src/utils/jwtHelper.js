import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h', // Or get from process.env.JWT_EXPIRES_IN
    });
};
