'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      role: {
        type: Sequelize.ENUM('job_seeker', 'employer', 'admin'),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: true,
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resume: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      education: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      preferred_categories: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
        defaultValue: [],
      },
      preferred_locations: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
        defaultValue: [],
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      email_otp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email_otp_expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reset_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reset_token_expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
