import db from '../models';

export const getSetting = async (key) => {
    try {
        const setting = await db.SystemSetting.findOne({ where: { key } });
        return {
            status: 200,
            data: setting ? setting.value : null
        };
    } catch (error) {
        console.error('Error in getSetting:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};

export const updateSetting = async (key, value) => {
    try {
        const [setting, created] = await db.SystemSetting.findOrCreate({
            where: { key },
            defaults: { value }
        });

        if (!created) {
            setting.value = value;
            await setting.save();
        }

        return {
            status: 200,
            message: 'Cập nhật cài đặt thành công',
            data: setting.value
        };
    } catch (error) {
        console.error('Error in updateSetting:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};
