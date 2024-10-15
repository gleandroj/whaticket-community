import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("UserQueues", {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      queueId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      companiesId: {
        type: DataTypes.INTEGER,
        references: { model: "Companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("UserQueues");
  }
};
