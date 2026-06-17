// Create a custom error with status code
export const createError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// Generate random certificate code
export const generateRandomCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Parse duration string (e.g., "15:30", "01:23:45") to seconds
export const parseDuration = (durationStr) => {
    if (!durationStr) return 0;
    if (typeof durationStr === 'number') return durationStr;
    const parts = durationStr.split(':').map(Number);
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
        return parts[0];
    }
    return 0;
};
