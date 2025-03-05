import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import GameResults from './GameResults.js';

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

export default GameResultsUser;