const { DataTypes } = require('sequelize');
const { CATEGORY_VALUES, EMPLOYER_TYPE_ENUM, VERIFICATION_STATUS_ENUM } = require('./enums');

module.exports = (sequelize) => {
  const EmployerProfile = sequelize.define('EmployerProfile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM(...EMPLOYER_TYPE_ENUM),
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    license_document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    national_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tin_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verification_status: {
      type: DataTypes.ENUM(...VERIFICATION_STATUS_ENUM),
      defaultValue: 'pending',
    },
    // Employer category (single enum)
    category: {
      type: DataTypes.ENUM(...CATEGORY_VALUES),
      allowNull: true,
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
    tableName: 'employer_profiles',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return EmployerProfile;
};
