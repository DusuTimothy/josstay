import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";
import { PAYMENT_STATUSES, type PaymentStatus } from "../types/domain";

export class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  declare id: CreationOptional<string>;
  declare bookingId: string;
  declare provider: CreationOptional<string>;
  declare reference: string;
  declare amount: number;
  declare status: CreationOptional<PaymentStatus>;
  declare channel: CreationOptional<string | null>;
  declare paidAt: CreationOptional<Date | null>;
  declare payload: CreationOptional<Record<string, unknown>>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: { type: DataTypes.UUID, allowNull: false },
    provider: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "paystack",
    },
    reference: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM(...PAYMENT_STATUSES),
      allowNull: false,
      defaultValue: "pending",
    },
    channel: { type: DataTypes.STRING(40), allowNull: true },
    paidAt: { type: DataTypes.DATE, allowNull: true },
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "payments",
    underscored: true,
    indexes: [{ fields: ["booking_id"] }, { fields: ["status"] }],
  },
);
