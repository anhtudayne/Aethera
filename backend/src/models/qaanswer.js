'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QAAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QAAnswer.belongsTo(models.QAQuestion, { foreignKey: 'questionId', as: 'question' });
      QAAnswer.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  QAAnswer.init({
    content: DataTypes.TEXT,
    questionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    isInstructor: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'QAAnswer',
  });
  return QAAnswer;
};