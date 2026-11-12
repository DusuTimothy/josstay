import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";
import { REVIEW_STATUSES, type ReviewStatus } from "../types/domain";

export class Review extends Model<
  InferAttributes<Review>,
  InferCreationAttributes<Review>
> {
  declare id: CreationOptional<string>;
  declare bookingId: string;
  declare hotelId: string;
  declare userId: string;
  declare rating: number;
  declare title: CreationOptional<string | null>;
  declare comment: CreationOptional<string | null>;
  declare status: CreationOptional<ReviewStatus>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: { type: DataTypes.UUID, allowNull: false, unique: true },
    hotelId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    rating: { type: DataTypes.FLOAT, allowNull: false },
    title: { type: DataTypes.STRING(160), allowNull: true },
    comment: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM(...REVIEW_STATUSES),
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "reviews",
    underscored: true,
    indexes: [{ fields: ["hotel_id"] }, { fields: ["status"] }],
  },
);
