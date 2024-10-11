import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement
} from "sequelize-typescript";

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

  @Column
  address: string;
}

export default Company;
