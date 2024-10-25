import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import { CompanyScope } from "./scopes";

@CompanyScope
@Table
class Setting extends Model<Setting> {
  static USER_CREATION_KEY = "userCreation";

  static USER_API_TOKEN_KEY = "userApiToken";

  @PrimaryKey
  @Column
  key: string;

  @Column
  value: string;

  @Column
  companyId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Setting;
