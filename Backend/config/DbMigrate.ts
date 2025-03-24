import { context, sequelize } from './DbStartup.js';

// Make sure to define types for dbContext and sequelize as needed

async function setupDatabase(): Promise<void> {
    try {
        // Sync the database (ensure tables exist without dropping them)
        await sequelize.sync({ force: false });

        // Check if users already exist
        const userCount: number = await context.User.count();
        if (userCount > 0) {
            console.log("Users already exist. Skipping seeding.");
        } else {
                    // Insert dummy users
        await context.User.bulkCreate([
            { username: "alice", email: "alice@example.com", password: "hashedpassword1" },
            { username: "bob", email: "bob@example.com", password: "hashedpassword2" },
            { username: "charlie", email: "charlie@example.com", password: "hashedpassword3" }
        ]);
        console.log("Dummy users added successfully!");
        }


    } catch (error) {
        // Type assertion for error since TypeScript does not infer errors automatically
        if (error instanceof Error) {
            console.error("Error setting up database:", error.message);
        } else {
            console.error("Unknown error setting up database");
        }
    } finally {
        await sequelize.close(); // Close connection after setup
    }
}

setupDatabase();
