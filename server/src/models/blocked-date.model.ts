import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";

/** A date range the hotel has taken off sale (walk-ins, maintenance, etc.). */
export class BlockedDate extends Model<
  InferAttributes<BlockedDate>,
  InferCreationAttributes<BlockedDate>
> {
  declare id: CreationOptional<string>;
  declare roomId: string;
  declare startDate: string;
  declare endDate: string;
  declare roomsBlocked: CreationOptional<number>;
  declare reason: CreationOptional<string | null>;
  declare createdBy: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BlockedDate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roomId: { type: DataTypes.UUID, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    roomsBlocked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    reason: { type: DataTypes.STRING(255), allowNull: true },
    createdBy: { type: DataTypes.UUID, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "blocked_dates",
    underscored: true,
    indexes: [
      { fields: ["room_id"] },
      { fields: ["start_date", "end_date"] },
    ],
  },
);
