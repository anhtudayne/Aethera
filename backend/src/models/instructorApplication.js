'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InstructorApplication extends Model {
    static associate(models) {
      InstructorApplication.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  InstructorApplication.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expertise: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experience: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    certificateImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING'
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'InstructorApplication',
  });
  return InstructorApplication;
};
