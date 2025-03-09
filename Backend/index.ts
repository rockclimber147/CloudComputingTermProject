import 'dotenv/config';
import userRoutes from './routes/UserRoutes.js';
import userNotificationRoutes from './routes/UserNotificationRoutes.js';
import gameResultsRoutes from './routes/GameResultsRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import startApp from './config/AppStartup.js';
import { app, server } from './config/Server.js';

const PORT = process.env.PORT || 3000;

//? maybe move these to the server file too?
app.use('/auth', authRoutes);

app.use('/api/users', userRoutes);
app.use('/api/notifications', userNotificationRoutes);
app.use('/api/GameResults', gameResultsRoutes);

app.get('/', async (req, res) => {
    res.send('Hello World');
});

startApp()
    .then(() => {
        server.listen(PORT, () => {
            console.log('Server is running on port', PORT);
        });
    })
    .catch((error) => {
        console.error('Error during application startup:', error);
        process.exit(1);
    });
