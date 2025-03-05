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
     ├── /node_modules    # Node.js dependencies (ignored in Git)
     ├── /src             # Source files
     │   ├── /modules     # Modules
     │   ├── index.ts     # Main entry point of the server
     ├── .env             # Local environment variables (not tracked in Git)
     ├── .gitignore       # Git ignore rules for sensitive files
     ├── nodemon.json     # Nodemon configuration
     ├── package.json     # Backend dependencies
     ├── package-lock.json # Dependency lock file
     ├── tsconfig.json    # TypeScript configuration
     ├── .prettierrc.json # Prettier configuration
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
