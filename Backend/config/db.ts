import "dotenv/config";
import { Sequelize } from "sequelize";

// Ensure that the environment variable is defined (with a fallback if needed)
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

async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Connected to Neon database successfully!");
  } catch (error: any) {
    console.error("Neon DB connection failed:", error);
  }
}

testConnection();

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


export { 
    sequelize,
    User,
    UserFriend,
    UserNotification,
    GameResults,
    GameResultsUser
 };
