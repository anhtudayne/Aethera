'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LoyaltyPoint extends Model {
        static associate(models) {
            LoyaltyPoint.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }
    LoyaltyPoint.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
            },
            points: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // Dương khi earn, âm khi spend
            },
            type: {
                type: DataTypes.ENUM('earn', 'spend'),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            referenceId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                // ID của review (khi earn) hoặc order (khi spend)
            },
        },
        {
            sequelize,
            modelName: 'LoyaltyPoint',
        }
    );
    return LoyaltyPoint;
};
