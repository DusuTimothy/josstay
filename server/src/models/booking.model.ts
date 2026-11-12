import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";
import { BOOKING_STATUSES, type BookingStatus } from "../types/domain";

export class Booking extends Model<
  InferAttributes<Booking>,
  InferCreationAttributes<Booking>
> {
  declare id: CreationOptional<string>;
  declare reference: string;
  declare userId: string;
  declare hotelId: string;
  declare roomId: string;
  declare checkIn: string;
  declare checkOut: string;
  declare nights: number;
  declare rooms: CreationOptional<number>;
  declare adults: CreationOptional<number>;
  declare children: CreationOptional<number>;
  declare status: CreationOptional<BookingStatus>;
  declare guestName: string;
  declare guestEmail: string;
  declare guestPhone: string;
  declare roomTotal: number;
  declare taxes: CreationOptional<number>;
  declare total: number;
  declare currency: CreationOptional<string>;
  declare commissionRate: number;
  declare commissionAmount: number;
  declare hotelShare: number;
  declare cancellationDeadline: CreationOptional<Date | null>;
  declare paystackReference: CreationOptional<string | null>;
  declare confirmedAt: CreationOptional<Date | null>;
  declare cancelledAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reference: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    hotelId: { type: DataTypes.UUID, allowNull: false },
    roomId: { type: DataTypes.UUID, allowNull: false },
    checkIn: { type: DataTypes.DATEONLY, allowNull: false },
    checkOut: { type: DataTypes.DATEONLY, allowNull: false },
    nights: { type: DataTypes.INTEGER, allowNull: false },
    rooms: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    adults: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    children: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM(...BOOKING_STATUSES),
      allowNull: false,
      defaultValue: "pending",
    },
    guestName: { type: DataTypes.STRING(160), allowNull: false },
    guestEmail: { type: DataTypes.STRING(160), allowNull: false },
    guestPhone: { type: DataTypes.STRING(30), allowNull: false },
    roomTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    taxes: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "NGN",
    },
    commissionRate: { type: DataTypes.FLOAT, allowNull: false },
    commissionAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    hotelShare: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    cancellationDeadline: { type: DataTypes.DATE, allowNull: true },
    paystackReference: { type: DataTypes.STRING(120), allowNull: true },
    confirmedAt: { type: DataTypes.DATE, allowNull: true },
    cancelledAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "bookings",
    underscored: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["hotel_id"] },
      { fields: ["room_id"] },
      { fields: ["status"] },
      { fields: ["check_in", "check_out"] },
    ],
  },
);
