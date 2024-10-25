import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey
} from "sequelize-typescript";
import Queue from "./Queue";
import User from "./User";
import Company from "./Company";

@Table
class UserQueue extends Model<UserQueue> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default UserQueue;
