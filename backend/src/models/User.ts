import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsToMany,
  HasMany,
  BelongsTo,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  CreatedAt,
  UpdatedAt
} from "sequelize-typescript";
import { hash, compare } from "bcryptjs";
import Company from "./Company";
import Ticket from "./Ticket";
import Queue from "./Queue";
import UserQueue from "./UserQueue";
import Whatsapp from "./Whatsapp";
import EmpresaFuncionario from "./EmpresaFuncionario";

@Table
class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  email: string;

  @Column(DataType.VIRTUAL)
  password: string;

  @Column
  passwordHash: string;

  @Column
  tokenVersion: number; // Propriedade adicionada

  @Column
  profile: string; // Propriedade adicionada

  @ForeignKey(() => Whatsapp)
  @Column({ type: DataType.INTEGER, allowNull: true }) // Definindo o tipo explicitamente
  whatsappId: number | null; // Permitir que a propriedade seja null

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp; // Propriedade adicionada

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Ticket)
  tickets: Ticket[];

  @BelongsToMany(() => Queue, () => UserQueue)
  queues: Queue[]; // Propriedade adicionada

  @BelongsToMany(() => Company, () => EmpresaFuncionario)
  company: Company[]; // Relação com a empresa

  @BeforeUpdate
  @BeforeCreate
  static hashPassword = async (instance: User): Promise<void> => {
    if (instance.password) {
      instance.passwordHash = await hash(instance.password, 8);
    }
  };

  public checkPassword = async (password: string): Promise<boolean> => {
    return compare(password, this.getDataValue("passwordHash"));
  };
}

export default User;
