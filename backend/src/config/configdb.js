import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
    }
);

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối database thành công.');
    } catch (error) {
        console.error('Không thể kết nối database:', error);
    }
};

export default connectDB;
