import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Setting from "../../models/Setting";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert(
      "Settings",
      [
        {
          key: Setting.USER_API_TOKEN_KEY,
          value: uuidv4(),
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
