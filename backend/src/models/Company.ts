import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany
} from "sequelize-typescript";
import User from "./User";
import EmpresaFuncionario from "./EmpresaFuncionario";

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

  @BelongsToMany(() => User, () => EmpresaFuncionario)
  userId: User[]; // Relação com User
}

export default Company;
