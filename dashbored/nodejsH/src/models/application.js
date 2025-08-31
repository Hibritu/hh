const { DataTypes } = require('sequelize');
const { APPLICATION_STATUS_ENUM } = require('./enums');

module.exports = (sequelize) => {
  const Application = sequelize.define('Application', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    resume: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cover_letter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...APPLICATION_STATUS_ENUM),
      defaultValue: 'submitted',
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'applications',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Application;
};
