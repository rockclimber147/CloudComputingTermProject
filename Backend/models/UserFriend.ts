import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

interface UserFriendAttributes {
  senderID: number;
  receiverID: number;
  dateCreated: Date;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

interface UserFriendCreationAttributes extends Optional<UserFriendAttributes, 'dateCreated'> {}

class UserFriend extends Model<UserFriendAttributes, UserFriendCreationAttributes> implements UserFriendAttributes {
  public senderID!: number;
  public receiverID!: number;
  public dateCreated!: Date;
  public status!: 'Pending' | 'Accepted' | 'Rejected';

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserFriend.init(
  {
    senderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    receiverID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserFriend',
  }
);

export default UserFriend;
