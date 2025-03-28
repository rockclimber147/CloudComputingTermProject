import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

// Define the attributes of the User model
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// User model definition
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Function to initialize the User model with sequelize
const initializeUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};

class UserBasicInfo {
    id: number;
    username: string;
    email: string;

    constructor (user: User) {
      this.id = user.id;
      this.username = user.username;
      this.email = user.email;
    }
}

class UserWithRoles extends UserBasicInfo {
  roles: number[]
  constructor(user: User, roles: number[] ) {
      super(user)
      this.roles = roles
  }
}

export {
    User,
    initializeUserModel,
    UserBasicInfo,
    UserWithRoles
}
