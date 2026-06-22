import db from '../models/index';

const User = db.User;

export const getUserProfile = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'otp', 'otpExpires'] },
        });
        if (!user) {
            return { status: 404, message: 'Không tìm thấy người dùng.' };
        }

        // Summary counts
        const enrolledCoursesCount = await db.UserCourse.count({ where: { userId } });
        const completedCoursesCount = await db.UserCourse.count({ where: { userId, status: 'completed' } });
        const certificatesCount = await db.Certificate.count({ where: { userId } });

        const userData = user.toJSON();
        userData.enrolledCoursesCount = enrolledCoursesCount;
        userData.completedCoursesCount = completedCoursesCount;
        userData.certificatesCount = certificatesCount;

        return { status: 200, data: userData };
    } catch (error) {
        console.error('Lỗi lấy hồ sơ:', error);
        throw error;
    }
};

export const updateUserProfile = async (userId, data) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return {
                status: 404,
                message: 'Không tìm thấy người dùng.',
            };
        }

        // Lọc ra các trường cho phép cập nhật để tránh lọt trường nhạy cảm như roleId, isActive, password
        const allowedUpdates = {};
        
        // Kiểm tra số điện thoại bị trùng
        if (data.phoneNumber !== undefined && data.phoneNumber !== user.phoneNumber) {
            const existingPhone = await User.findOne({ where: { phoneNumber: data.phoneNumber } });
            if (existingPhone) {
                return {
                    status: 409, // Conflict
                    message: 'Số điện thoại này đã được sử dụng bởi tài khoản khác.',
                };
            }
            allowedUpdates.phoneNumber = data.phoneNumber;
        }


        if (data.firstName !== undefined) allowedUpdates.firstName = data.firstName;
        if (data.lastName !== undefined) allowedUpdates.lastName = data.lastName;
        if (data.address !== undefined) allowedUpdates.address = data.address;
        if (data.gender !== undefined) allowedUpdates.gender = data.gender;
        if (data.image !== undefined) allowedUpdates.image = data.image;
        if (data.bio !== undefined) allowedUpdates.bio = data.bio;

        await user.update(allowedUpdates);

        // Lấy lại dữ liệu mới (ẩn password và otp)
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'otp', 'otpExpires'] },
        });

        return {
            status: 200,
            message: 'Cập nhật hồ sơ thành công.',
            data: updatedUser,
        };
    } catch (error) {
        console.error('Lỗi cập nhật hồ sơ:', error);
        throw error;
    }
};

// Helper: Lấy ngày Thứ Hai của tuần hiện tại (bỏ giờ phút)
const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday
    return new Date(d.getFullYear(), d.getMonth(), diff);
};

export const getUserStreak = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) return { status: 404, message: 'User not found' };

        const now = new Date();
        const startOfCurrentWeek = getStartOfWeek(now);

        // Check if weekStartDate is outdated
        let needUpdate = false;
        let newStreakWeeks = user.streakWeeks || 0;
        let newVisits = user.weeklyVisits || 0;
        let newMinutes = user.weeklyMinutes || 0;
        let newWeekStart = user.weekStartDate;

        if (!user.weekStartDate || new Date(user.weekStartDate).getTime() !== startOfCurrentWeek.getTime()) {
            const startOfLastWeek = new Date(startOfCurrentWeek);
            startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

            if (user.weekStartDate && new Date(user.weekStartDate).getTime() === startOfLastWeek.getTime() && user.weeklyVisits > 0) {
                // Maintained streak from last week
                newStreakWeeks += 1;
            } else if (!user.weekStartDate || new Date(user.weekStartDate).getTime() < startOfLastWeek.getTime()) {
                // Streak broken
                newStreakWeeks = 0;
            }

            newWeekStart = startOfCurrentWeek;
            newVisits = 0;
            newMinutes = 0;
            needUpdate = true;
        }

        if (needUpdate) {
            await user.update({
                streakWeeks: newStreakWeeks,
                weekStartDate: newWeekStart,
                weeklyVisits: newVisits,
                weeklyMinutes: newMinutes
            });
        }

        return {
            status: 200,
            data: {
                streakWeeks: newStreakWeeks,
                weeklyVisits: newVisits,
                weeklyMinutes: newMinutes,
                lastActivityDate: user.lastActivityDate,
                weekStartDate: newWeekStart
            }
        };
    } catch (error) {
        console.error('Lỗi lấy streak:', error);
        throw error;
    }
};

export const logUserActivity = async (userId, minutesWatched = 0) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) return { status: 404, message: 'User not found' };

        const now = new Date();
        const startOfCurrentWeek = getStartOfWeek(now);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let updates = {};

        // Tiền xử lý chuyển đổi tuần giống getUserStreak
        if (!user.weekStartDate || new Date(user.weekStartDate).getTime() !== startOfCurrentWeek.getTime()) {
            const startOfLastWeek = new Date(startOfCurrentWeek);
            startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
            
            let newStreakWeeks = user.streakWeeks || 0;
            if (user.weekStartDate && new Date(user.weekStartDate).getTime() === startOfLastWeek.getTime() && user.weeklyVisits > 0) {
                newStreakWeeks += 1;
            } else if (!user.weekStartDate || new Date(user.weekStartDate).getTime() < startOfLastWeek.getTime()) {
                newStreakWeeks = 0;
            }
            
            updates.streakWeeks = newStreakWeeks;
            updates.weekStartDate = startOfCurrentWeek;
            updates.weeklyVisits = 0;
            updates.weeklyMinutes = 0;
        } else {
            updates.streakWeeks = user.streakWeeks || 0;
            updates.weeklyVisits = user.weeklyVisits || 0;
            updates.weeklyMinutes = user.weeklyMinutes || 0;
        }

        // Add minutes
        if (minutesWatched > 0) {
            updates.weeklyMinutes += Number(minutesWatched);
        }

        // Check daily visit (chỉ tính 1 lần mỗi ngày)
        const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
        const lastActivityDay = lastActivity ? new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate()) : null;

        if (!lastActivityDay || lastActivityDay.getTime() !== today.getTime()) {
            updates.weeklyVisits += 1;
            updates.lastActivityDate = now; // update to current timestamp
        }

        await user.update(updates);

        return {
            status: 200,
            data: {
                streakWeeks: updates.streakWeeks,
                weeklyVisits: updates.weeklyVisits,
                weeklyMinutes: updates.weeklyMinutes,
                lastActivityDate: updates.lastActivityDate || user.lastActivityDate,
                weekStartDate: updates.weekStartDate || user.weekStartDate
            }
        };
    } catch (error) {
        console.error('Lỗi log activity:', error);
        throw error;
    }
};

