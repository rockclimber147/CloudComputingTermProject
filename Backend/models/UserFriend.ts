import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { User } from '../config/DbStartup.js'; 

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

// Function to initialize the UserFriend model with sequelize
export const initializeUserFriendModel = (sequelize: Sequelize, UserModel: typeof User): typeof UserFriend => {
  UserFriend.init(
    {
      senderID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: UserModel,  // Reference to the User model
          key: 'id',
        },
      },
      receiverID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: UserModel,  // Reference to the User model
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
  return UserFriend;
};
