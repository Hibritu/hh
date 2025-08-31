const { DataTypes } = require('sequelize');
const { EMPLOYMENT_TYPE_ENUM, LISTING_TYPE_ENUM, JOB_STATUS_ENUM } = require('./enums');

module.exports = (sequelize) => {
  const Job = sequelize.define('Job', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employment_type: {
      type: DataTypes.ENUM(...EMPLOYMENT_TYPE_ENUM),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salary: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    listing_type: {
      type: DataTypes.ENUM(...LISTING_TYPE_ENUM),
      allowNull: false,
      defaultValue: 'free',
    },
    status: {
      type: DataTypes.ENUM(...JOB_STATUS_ENUM),
      allowNull: false,
      defaultValue: 'pending',
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
    tableName: 'jobs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Job;
};
