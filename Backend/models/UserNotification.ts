import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

interface UserNotificationAttributes {
  userID: number;
  message: string;
  time: Date;
  seen: boolean;
  sentBy: number | null;  // Can be null for some notifications
}

interface UserNotificationCreationAttributes extends Optional<UserNotificationAttributes, 'sentBy'> {}

class UserNotification extends Model<UserNotificationAttributes, UserNotificationCreationAttributes> implements UserNotificationAttributes {
  public userID!: number;
  public message!: string;
  public time!: Date;
  public seen!: boolean;
  public sentBy!: number | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserNotification.init(
  {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sentBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'UserNotification',
  }
);

export default UserNotification;
