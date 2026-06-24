'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QAUpvote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QAUpvote.belongsTo(models.QAQuestion, { foreignKey: 'questionId', as: 'question' });
      QAUpvote.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  QAUpvote.init({
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QAUpvote',
  });
  return QAUpvote;
};