import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";
import {
  CANCELLATION_POLICIES,
  HOTEL_STATUSES,
  type CancellationPolicy,
  type HotelStatus,
} from "../types/domain";

/**
 * Money fields use DECIMAL. node-postgres returns DECIMAL as a string, so
 * controllers must convert them with Number(...) before sending JSON.
 */
export class Hotel extends Model<
  InferAttributes<Hotel>,
  InferCreationAttributes<Hotel>
> {
  declare id: CreationOptional<string>;
  declare managerId: CreationOptional<string | null>;
  declare name: string;
  declare slug: string;
  declare description: CreationOptional<string | null>;
  declare propertyType: CreationOptional<string>;
  declare address: string;
  declare area: string;
  declare city: CreationOptional<string>;
  declare state: CreationOptional<string>;
  declare latitude: CreationOptional<number | null>;
  declare longitude: CreationOptional<number | null>;
  declare distanceKm: CreationOptional<number>;
  declare rating: CreationOptional<number>;
  declare reviewCount: CreationOptional<number>;
  declare priceFrom: number;
  declare currency: CreationOptional<string>;
  declare amenities: CreationOptional<string[]>;
  declare breakfastIncluded: CreationOptional<boolean>;
  declare freeCancellation: CreationOptional<boolean>;
  declare cancellationPolicy: CreationOptional<CancellationPolicy>;
  declare status: CreationOptional<HotelStatus>;
  declare verifiedAt: CreationOptional<Date | null>;
  declare publishedAt: CreationOptional<Date | null>;
  declare commissionRate: CreationOptional<number>;
  declare paystackSubaccountCode: CreationOptional<string | null>;
  declare phone: CreationOptional<string | null>;
  declare email: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Hotel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    managerId: { type: DataTypes.UUID, allowNull: true },
    name: { type: DataTypes.STRING(160), allowNull: false },
    slug: { type: DataTypes.STRING(180), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    propertyType: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "Hotel",
    },
    address: { type: DataTypes.STRING(255), allowNull: false },
    area: { type: DataTypes.STRING(120), allowNull: false },
    city: {
      type: DataTypes.STRING(80),
      allowNull: false,
      defaultValue: "Jos",
    },
    state: {
      type: DataTypes.STRING(80),
      allowNull: false,
      defaultValue: "Plateau",
    },
    latitude: { type: DataTypes.FLOAT, allowNull: true },
    longitude: { type: DataTypes.FLOAT, allowNull: true },
    distanceKm: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    reviewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    priceFrom: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "NGN",
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
    cancellationPolicy: {
      type: DataTypes.ENUM(...CANCELLATION_POLICIES),
      allowNull: false,
      defaultValue: "moderate",
    },
    status: {
      type: DataTypes.ENUM(...HOTEL_STATUSES),
      allowNull: false,
      defaultValue: "pending",
    },
    verifiedAt: { type: DataTypes.DATE, allowNull: true },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    commissionRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.12,
    },
    paystackSubaccountCode: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    email: { type: DataTypes.STRING(160), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "hotels",
    underscored: true,
    indexes: [
      { fields: ["status"] },
      { fields: ["area"] },
      { fields: ["price_from"] },
      { fields: ["rating"] },
    ],
  },
);
