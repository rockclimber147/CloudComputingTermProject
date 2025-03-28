import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from '../models/User.js'; 

interface UserRoleAttributes {
  userId: number;
  roleId: number;
}

class UserRole extends Model<UserRoleAttributes> implements UserRoleAttributes {
  public userId!: number;
  public roleId!: number;
}

const initializeUserRoleModel = (sequelize: Sequelize, UserModel: typeof User): typeof UserRole => {
  UserRole.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: UserModel,
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: UserModel,
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'UserRole',
    }
  );
  return UserRole;
};

export { UserRole, initializeUserRoleModel };
