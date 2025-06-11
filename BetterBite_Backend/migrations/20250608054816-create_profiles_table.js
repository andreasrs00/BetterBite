"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("profiles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      foto_profil: {
        allowNull: false,
        type: Sequelize.TEXT('medium'),
      },
      nama: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      tinggi: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Height in cm",
      },
      berat: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: "Weight in kg",
      },
      usia: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Age in years",
      },
      bmi: {
        type: Sequelize.DECIMAL(4, 1),
        allowNull: true,
        comment: "BMI value",
      },
      target: {
        type: Sequelize.ENUM("Diet", "Bulking", "Maintenance"),
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("profiles");
  },
};
