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

const User = require("../models/User.js")(sequelize);
const UserFriend = require("../models/UserFriend.js")(sequelize, User);
const UserNotification = require("../models/UserNotification.js")(sequelize, User);
const GameResults = require("../models/GameResults.js")(sequelize, User);
const GameResultsUser = require("../models/GameResultsUser.js")(sequelize, User);

export { 
    sequelize
}
