const { DataTypes } = require('sequelize');
const { REPORT_STATUS_ENUM } = require('./enums');

module.exports = (sequelize) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reported_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    chat_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...REPORT_STATUS_ENUM),
      allowNull: false,
      defaultValue: 'pending',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'reports',
    underscored: true,
    timestamps: false,
  });

  return Report;
};
