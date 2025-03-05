# Backend for Cloud Computing Term Project

## Overview

This is the backend for the Cloud Computing Term Project, a real-time game platform. The backend is built using Node.js and Express.js, and it handles user authentication, game state management, and real-time communication.

## Tech Stack

-   **Node.js**: JavaScript runtime
-   **Express.js**: Web framework for Node.js
-   **TypeScript**: Superset of JavaScript for type safety
-   **WebSockets**: Real-time communication
-   **Redis**: In-memory data structure store for game state management

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:

-   [Node.js](https://nodejs.org/) (>= 14.x)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for managing dependencies

### Installation

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/your-username/game-project.git
    cd game-project/backend
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:

    - Create a `.env` file in the `/backend` folder with the required variables. Example:
        ```env
        PORT=3000
        REDIS_URL=redis://localhost:6379
        ```

4. **Build the Project**:

    ```bash
    npm run build
    ```

5. **Start the Server**:
    ```bash
    npm start
    ```

## Running Locally

1. **Start Backend**:
    - The backend will run on `http://localhost:3000` by default.

## Scripts

-   `npm run dev`: Start the server in development mode with hot reloading.
-   `npm run build`: Compile TypeScript to JavaScript.
-   `npm start`: Start the server in production mode.

## Folder Structure

```
/backend
├── .env                                # Environment Variables (not tracked in Git)
├── .gitignore                          # Git ignore rules for sensitive files
├── .prettierrc.json                    # Prettier configuration for code formatting
├── index.ts                            # Main entry point of the application
├── nodemon.json                        # Configuration for nodemon (automatic server restarts)
├── package-lock.json                   # Dependency lock file (generated automatically)
├── package.json                        # Project metadata and dependencies
├── README.md                           # Project documentation (this file)
├── structure.txt                       # Directory structure or additional project info
├── tsconfig.json                       # TypeScript configuration file
|
├---config
|   ├── DbStartup.ts                       # Database initialization and connection setup
|   ├── RepositoryInit.ts                  # Repository pattern initialization (data access layer)
|
├---dist
|   # Compiled JavaScript files after TypeScript compilation
|
├---models
|   ├── GameResults.ts                     # Model for game results (user performance in games)
|   ├── GameResultsUser.ts                 # Model for game results linked to users
|   ├── User.ts                            # User model for user data (authentication and profiles)
|   ├── UserFriend.ts                      # Model for friend relationships between users
|   ├── UserNotification.ts                # Model for user notifications (alerts and messages)
|
├---modules
|   ├── ErrorHandling.ts                   # Custom error handling utilities
|   ├── test_module.ts                     # testing
|
├---repositories
|   ├── GameResultsRepository.ts           # Logic for handling game results
|   ├── UserNotificationRepository.ts      # Logic for handling user notifications
|   ├── UserRepository.ts                  # Logic for handling user data 
|
├---routes
|   ├── GameResultsRoutes.ts               # API routes for game results
|   ├── UserNotificationRoutes.ts          # API routes for user notifications
|   ├── UserRoutes.ts                      # API routes for user management
```

## Contributing

Feel free to fork this project, submit issues, or send pull requests. Here’s how you can contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
