import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseUrl: string = process.env.DATABASE_URL || "";

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

async function connectToSQLDB(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Connected to Neon database successfully!");
  } catch (error: any) {
    console.error("Neon DB connection failed:", error);
  }
}

import { initializeUserModel } from "../models/User.js";
import { initializeUserFriendModel } from "../models/UserFriend.js";

const User = initializeUserModel(sequelize);
const UserFriend = initializeUserFriendModel(sequelize, User);

import { initializeUserNotificationModel } from "../models/UserNotification.js";
import { initializeGameResultsModel } from "../models/GameResults.js";
import { initializeGameResultsUserModel } from "../models/GameResultsUser.js";

const UserNotification = initializeUserNotificationModel(sequelize, User);
const GameResults = initializeGameResultsModel(sequelize, User);
const GameResultsUser = initializeGameResultsUserModel(sequelize, User);


class DbContext {
    public User: typeof User;
    public UserFriend: typeof UserFriend;
    public UserNotification: typeof UserNotification;
    public GameResults: typeof GameResults;
    public GameResultsUser: typeof GameResultsUser;
  
    constructor() {
      this.User = User;
      this.UserFriend = UserFriend;
      this.UserNotification = UserNotification;
      this.GameResults = GameResults;
      this.GameResultsUser = GameResultsUser;
    }
}

const context: DbContext = new DbContext();

export { 
    connectToSQLDB,
    sequelize,
    User,
    UserFriend,
    UserNotification,
    GameResults,
    GameResultsUser,
    DbContext,
    context
 };
