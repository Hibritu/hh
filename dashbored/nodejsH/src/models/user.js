const { DataTypes } = require('sequelize');
const {
  CATEGORY_VALUES,
  ROLE_ENUM,
  GENDER_ENUM,
} = require('./enums');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM(...ROLE_ENUM),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(...GENDER_ENUM),
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resume: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    education: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    preferred_categories: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: [],
    },
    preferred_locations: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: [],
    },
    // Removed problematic category enum array 'cat' to avoid Postgres enum cast errors during sync
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email_otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_otp_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_token_expires_at: {
      type: DataTypes.DATE,
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
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  User.CATEGORY_VALUES = CATEGORY_VALUES;

  return User;
};
