import { QueryInterface } from "sequelize";
import Setting from "../../models/Setting";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert(
      "Settings",
      [
        {
          key: Setting.USER_CREATION_KEY,
          value: "enabled",
          companyId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Settings", {});
  }
};
