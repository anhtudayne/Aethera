'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Section.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
      Section.hasMany(models.Lesson, { foreignKey: 'sectionId', as: 'lessons' });
    }
  }
  Section.init({
    courseId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Section',
  });
  return Section;
};