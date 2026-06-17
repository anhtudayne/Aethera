'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Certificate extends Model {
        static associate(models) {
            Certificate.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Certificate.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
        }
    }
    Certificate.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
            },
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Courses', key: 'id' },
            },
            certificateCode: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true, // e.g. CERT-2026-A1B2C3
            },
            issuedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Certificate',
            indexes: [
                { unique: true, fields: ['userId', 'courseId'], name: 'certificates_user_course_unique' },
            ],
        }
    );
    return Certificate;
};
