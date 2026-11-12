import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";

export class Room extends Model<
  InferAttributes<Room>,
  InferCreationAttributes<Room>
> {
  declare id: CreationOptional<string>;
  declare hotelId: string;
  declare name: string;
  declare description: CreationOptional<string | null>;
  declare bedType: CreationOptional<string>;
  declare maxAdults: CreationOptional<number>;
  declare maxChildren: CreationOptional<number>;
  declare sizeSqm: CreationOptional<number>;
  declare pricePerNight: number;
  declare totalRooms: CreationOptional<number>;
  declare amenities: CreationOptional<string[]>;
  declare images: CreationOptional<string[]>;
  declare breakfastIncluded: CreationOptional<boolean>;
  declare freeCancellation: CreationOptional<boolean>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hotelId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(160), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    bedType: {
      type: DataTypes.STRING(80),
      allowNull: false,
      defaultValue: "1 double bed",
    },
    maxAdults: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    maxChildren: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sizeSqm: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    pricePerNight: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    totalRooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: [],
    },
    breakfastIncluded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    freeCancellation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "rooms",
    underscored: true,
    indexes: [{ fields: ["hotel_id"] }],
  },
);
