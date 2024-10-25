import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany
} from "sequelize-typescript";
import User from "./User";
import UserCompany from "./UserCompany";

@Table
class Company extends Model<Company> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  cnpj: string;

  @BelongsToMany(() => User, () => UserCompany)
  userId: User[]; // Relação com User
}

export default Company;
