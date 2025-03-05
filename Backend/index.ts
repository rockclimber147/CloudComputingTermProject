import express from 'express';
import { bruh } from './modules/test_module.js';
import userRoutes from './routes/UserRoutes.js'
import userNotificationRoutes from './routes/UserNotificationRoutes.js'
import gameResultsRoutes from './routes/GameResultsRoutes.js'
import startApp from './config/Startup.js';

const app = express();

app.use('/api/users', userRoutes)
app.use('/api/notifications', userNotificationRoutes)
app.use('/api/GameResults', gameResultsRoutes)

app.get('/', async (req, res) => {
    console.log(bruh);
    res.send("Hello World");
});

startApp().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((error) => {
    console.error('Error during application startup:', error);
    process.exit(1);
  });

