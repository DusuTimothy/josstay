import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";

/**
 * A short-lived hold placed while the guest is on the Paystack checkout.
 * Expired holds are ignored by the availability calculation.
 */
export class AvailabilityHold extends Model<
  InferAttributes<AvailabilityHold>,
  InferCreationAttributes<AvailabilityHold>
> {
  declare id: CreationOptional<string>;
  declare roomId: string;
  declare sessionId: string;
  declare checkIn: string;
  declare checkOut: string;
  declare rooms: CreationOptional<number>;
  declare expiresAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AvailabilityHold.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roomId: { type: DataTypes.UUID, allowNull: false },
    sessionId: { type: DataTypes.STRING(120), allowNull: false },
    checkIn: { type: DataTypes.DATEONLY, allowNull: false },
    checkOut: { type: DataTypes.DATEONLY, allowNull: false },
    rooms: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "availability_holds",
    underscored: true,
    indexes: [
      { fields: ["room_id"] },
      { fields: ["expires_at"] },
      { fields: ["check_in", "check_out"] },
    ],
  },
);
