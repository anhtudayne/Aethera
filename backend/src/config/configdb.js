import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config.json')[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
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
