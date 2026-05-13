// Generate 6-digit random OTP
export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

// Calculate OTP expiration time
export const getOTPExpireTime = (minutes) => {
    const expireMinutes = minutes || parseInt(process.env.OTP_EXPIRE_MINUTES) || 5;
    return new Date(Date.now() + expireMinutes * 60 * 1000);
};
