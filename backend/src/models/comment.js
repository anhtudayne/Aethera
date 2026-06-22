'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
            Comment.belongsTo(models.Course, {
                foreignKey: 'courseId',
                as: 'course',
            });
            Comment.belongsTo(models.Comment, {
                foreignKey: 'parentId',
                as: 'parent',
            });
            Comment.hasMany(models.Comment, {
                foreignKey: 'parentId',
                as: 'replies',
            });
        }
    }
    Comment.init(
        {
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Courses',
                    key: 'id',
                },
            },
            parentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'Comments',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
        },
        {
            sequelize,
            modelName: 'Comment',
            tableName: 'Comments',
        }
    );
    return Comment;
};
