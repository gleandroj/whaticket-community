import { compare, hash } from "bcryptjs";
import {
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import Company from "./Company";
import Queue from "./Queue";
import Ticket from "./Ticket";
import UserCompany from "./UserCompany";
import UserQueue from "./UserQueue";
import Whatsapp from "./Whatsapp";

@Table
@Scopes(() => ({
  companyId: (companyId: number) => ({
    include: [
      {
        model: Company,
        where: { id: companyId }
      }
    ]
  })
}))
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
  queues: Queue[];

  @BelongsToMany(() => Company, () => UserCompany)
  companies: Array<Company & { UserCompany: UserCompany }>;

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

  public getActiveCompany = ():
    | (Company & { UserCompany: UserCompany })
    | undefined => {
    return this.companies.find(company => company.UserCompany.isActive);
  };
}

export default User;
