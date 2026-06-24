'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QAQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QAQuestion.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      QAQuestion.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
      QAQuestion.belongsTo(models.Lesson, { foreignKey: 'lessonId', as: 'lesson' });
      QAQuestion.hasMany(models.QAAnswer, { foreignKey: 'questionId', as: 'answers' });
      QAQuestion.hasMany(models.QAUpvote, { foreignKey: 'questionId', as: 'upvotesList' });
    }
  }
  QAQuestion.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    courseId: DataTypes.INTEGER,
    lessonId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    upvotesCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QAQuestion',
  });
  return QAQuestion;
};