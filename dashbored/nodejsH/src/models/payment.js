const { DataTypes } = require('sequelize');
const { PAYMENT_STATUS_ENUM, PAYMENT_PROVIDER_ENUM } = require('./enums');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    employer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ETB',
    },
    status: {
      type: DataTypes.ENUM(...PAYMENT_STATUS_ENUM),
      allowNull: false,
      defaultValue: 'pending',
    },
    provider: {
      type: DataTypes.ENUM(...PAYMENT_PROVIDER_ENUM),
      allowNull: false,
      defaultValue: 'chapa',
    },
    transaction_ref: {
      type: DataTypes.STRING,
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
    tableName: 'payments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Payment;
};
