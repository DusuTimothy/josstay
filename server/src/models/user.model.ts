import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";
import { USER_ROLES, type UserRole } from "../types/domain";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phone: CreationOptional<string | null>;
  declare passwordHash: CreationOptional<string | null>;
  declare googleId: CreationOptional<string | null>;
  declare role: CreationOptional<UserRole>;
  declare referralCode: string;
  declare referredByUserId: CreationOptional<string | null>;
  declare emailVerified: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING(80), allowNull: false },
    lastName: { type: DataTypes.STRING(80), allowNull: false },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    passwordHash: { type: DataTypes.STRING, allowNull: true },
    googleId: { type: DataTypes.STRING(120), allowNull: true, unique: true },
    role: {
      type: DataTypes.ENUM(...USER_ROLES),
      allowNull: false,
      defaultValue: "guest",
    },
    referralCode: { type: DataTypes.STRING(16), allowNull: false, unique: true },
    referredByUserId: { type: DataTypes.UUID, allowNull: true },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "users",
    underscored: true,
    indexes: [{ fields: ["role"] }],
  },
);
