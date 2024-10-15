import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey
} from "sequelize-typescript";
import User from "./User";
import Company from "./Company";

@Table
class EmpresaFuncionario extends Model<EmpresaFuncionario> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
export default EmpresaFuncionario;
