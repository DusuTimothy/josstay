import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";

export class HotelImage extends Model<
  InferAttributes<HotelImage>,
  InferCreationAttributes<HotelImage>
> {
  declare id: CreationOptional<string>;
  declare hotelId: string;
  declare url: string;
  declare publicId: CreationOptional<string | null>;
  declare alt: CreationOptional<string>;
  declare sortOrder: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

HotelImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hotelId: { type: DataTypes.UUID, allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    publicId: { type: DataTypes.STRING(255), allowNull: true },
    alt: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "hotel_images",
    underscored: true,
    indexes: [{ fields: ["hotel_id"] }],
  },
);
