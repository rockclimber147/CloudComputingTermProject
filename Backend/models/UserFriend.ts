import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { User } from '../models/User.js'; 

enum UserFriendStatusEnum {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected"
}

interface UserFriendAttributes {
  senderID: number;
  receiverID: number;
  dateCreated: Date;
  status: UserFriendStatusEnum.Pending | UserFriendStatusEnum.Accepted | UserFriendStatusEnum.Rejected;
  dateAccepted?: Date;
}

interface UserFriendCreationAttributes extends Optional<UserFriendAttributes, 'dateCreated'> {}

class UserFriend extends Model<UserFriendAttributes, UserFriendCreationAttributes> implements UserFriendAttributes {
  public senderID!: number;
  public receiverID!: number;
  public dateCreated!: Date;
  public status!: UserFriendStatusEnum.Pending | UserFriendStatusEnum.Accepted | UserFriendStatusEnum.Rejected;
  dateAccepted?: Date;
  
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
          model: UserModel,
          key: 'id',
        },
      },
      receiverID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: UserModel,
          key: 'id',
        },
      },
      dateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM(UserFriendStatusEnum.Pending, UserFriendStatusEnum.Accepted, UserFriendStatusEnum.Rejected),
        allowNull: false,
        defaultValue: UserFriendStatusEnum.Pending,
      },
      dateAccepted: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,  // Allow null until the friend request is accepted
      },
    },
    {
      sequelize,
      modelName: 'UserFriend',
    }
  );


  UserFriend.afterUpdate(async (instance) => {
    if (instance.status === UserFriendStatusEnum.Accepted && !instance.dateAccepted) {
      instance.dateAccepted = new Date(); // Set the current date and time when the status is changed to Accepted
      await instance.save(); // Save the instance to update the dateAccepted field
    }
  });

  return UserFriend;
};

class Friend {
  public id: number;
  public username: string;
  public email: string;
  public status: UserFriendStatusEnum;
  public dateCreated: Date;
  public dateAccepted?: Date;

  constructor(user: User, userFriend: UserFriend) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.status = userFriend.status;
    this.dateCreated = userFriend.dateCreated;
    this.dateAccepted = userFriend.dateAccepted;
  }
}

export { 
  UserFriend,
  UserFriendStatusEnum,
  Friend
 }
