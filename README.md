# Cloud Computing Term Project

## Overview
This project is a real-time game platform where users can create accounts, form game lobbies, and invite other users to play games. The platform uses WebSockets for real-time communication and Redis for game state management.

## Authors

- [Daylen Smith](https://github.com/rockclimber147)
- [Pouyan Norouzi](https://github.com/PouyanNorouzi)
- [Tommy Phuong](https://github.com/TommyPhuongg)

---

### Frontend
```
/frontend
    ├── /assets          # Static files (images, fonts, etc.)
    ├── /styles          # CSS or SCSS files
    ├── index.html       # Main entry HTML file
```

### Backend
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

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Real-Time Communication**: WebSockets (via `ws` or `socket.io`)
- **Database**: NoSQL (e.g., MongoDB or DynamoDB)
- **Game State Management**: Redis (for real-time updates)
- **Email Service**: AWS SES (Simple Email Service) for sending invites
- **Authentication**: JWT (JSON Web Tokens) or sessions

---

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (>= 14.x)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for managing dependencies

---

### Installation

1. **Clone the Repository**:
   ```
   git clone https://github.com/your-username/game-project.git
   cd game-project
   ```

2. **Install Backend Dependencies**:
   Navigate to the `/backend` folder and install the required dependencies:
   ``` 
   cd backend
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the `/backend` folder with the required variables. Example:
     ``` 

     ```

4. **Start the Backend**:
   ``` 
   npm start
   ```


5. **Start the Frontend** (if applicable):
   ``` 
   npm start
   ```

---

## Running Locally

1. **Start Backend**:
   - The backend will run on `http://localhost:3001` by default.

2. **Start Frontend**:
   - The frontend will be available at `http://localhost:3000` by default.

---

## Git Ignore

The following files and directories are ignored in this repository:
- `/node_modules/`: Node.js dependencies
- `.env`: Environment variables (Do not track sensitive information)
- `npm-debug.log*`, `yarn-debug.log*`: Debugging logs

---

## Deployment

### Backend

The backend can be deployed on **AWS EC2**, **Heroku**, or another cloud provider. 

- Use services like **AWS Elastic Beanstalk** for easy deployment and scaling.
- Set up environment variables on your cloud provider.

### Frontend

The frontend can be hosted using **AWS S3** for static file hosting, or **Netlify**, **Vercel**, etc.

---

## Contributing

Feel free to fork this project, submit issues, or send pull requests. Here’s how you can contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a new Pull Request
