import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert(
      "Companies",
      [
        {
          name: "Administrador",
          email: "admin@whaticket.com",
          cnpj: "82.434.698/0001-18",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Companies", {});
  }
};
