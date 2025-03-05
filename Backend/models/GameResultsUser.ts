import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { User, GameResults } from '../config/DbStartup.js'; 

interface GameResultsUserAttributes {
  userID: number;
  gameID: number;
}

interface GameResultsUserCreationAttributes extends Optional<GameResultsUserAttributes, 'gameID'> {}

class GameResultsUser extends Model<GameResultsUserAttributes, GameResultsUserCreationAttributes> implements GameResultsUserAttributes {
  public userID!: number;
  public gameID!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeGameResultsUserModel = (sequelize: Sequelize, UserModel: typeof User): typeof GameResultsUser => {
    GameResultsUser.init(
    {
        userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        },
        gameID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: GameResults,
            key: 'id',
        },
        },
    },
    {
        sequelize,
        modelName: 'GameResultsUser',
    }
    );
    return GameResultsUser;
};