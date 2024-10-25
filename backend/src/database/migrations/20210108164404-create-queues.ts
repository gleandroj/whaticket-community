import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Queues", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false
      },
      greetingMessage: {
        type: DataTypes.TEXT
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      companyId: {
        type: DataTypes.INTEGER,
        references: { model: "Companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      }
    });

    await queryInterface.addConstraint("Queues", ["name", "companyId"], {
      type: "unique",
      name: "queues_unique_queue_name_company_id"
    });

    await queryInterface.addConstraint("Queues", ["color", "companyId"], {
      type: "unique",
      name: "queues_unique_queue_color_company_id"
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Queues");
  }
};
