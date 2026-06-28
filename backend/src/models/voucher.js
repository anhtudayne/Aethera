'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      // define association here
    }
  }
  Voucher.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    discountType: {
      type: DataTypes.ENUM('PERCENTAGE', 'FIXED'),
      defaultValue: 'PERCENTAGE',
    },
    discountValue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    maxDiscountValue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true, // null = effective immediately
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    maxUsage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'DISABLED'),
      defaultValue: 'ACTIVE',
    }
  }, {
    sequelize,
    modelName: 'Voucher',
    tableName: 'Vouchers',
    timestamps: true,
  });
  return Voucher;
};
