import { Model, DataTypes, Sequelize } from 'sequelize';

enum RoleIdEnum {
    ADMIN = 1
}

interface RoleAttributes {
  id: number;
  roleType: string;
}

class Role extends Model<RoleAttributes> implements RoleAttributes {
  public id!: number;
  public roleType!: string;
}

const initializeRoleModel = (sequelize: Sequelize): typeof Role => {
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleType: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Role',
    }
  );
  return Role;
};

export { Role, initializeRoleModel, RoleIdEnum };