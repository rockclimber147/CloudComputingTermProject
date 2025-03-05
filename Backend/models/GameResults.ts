import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { User } from '../config/DbStartup.js'; 

interface GameResultsAttributes {
  id: number;
  gameName: string;
  winnerID: number;
  startTime: Date;
  endTime: Date;
}

interface GameResultsCreationAttributes extends Optional<GameResultsAttributes, 'id'> {}

class GameResults extends Model<GameResultsAttributes, GameResultsCreationAttributes> implements GameResultsAttributes {
  public id!: number;
  public gameName!: string;
  public winnerID!: number;
  public startTime!: Date;
  public endTime!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeGameResultsModel = (sequelize: Sequelize, UserModel: typeof User): typeof GameResults => {
    GameResults.init(
    {
        id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        },
        gameName: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        winnerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        },
        startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        },
        endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'GameResults',
    }
    );
    return GameResults;
};

