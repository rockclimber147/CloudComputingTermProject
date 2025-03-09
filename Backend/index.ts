import express from 'express';
import { bruh } from './modules/test_module.js';
import userRoutes from './routes/UserRoutes.js';
import userNotificationRoutes from './routes/UserNotificationRoutes.js';
import gameResultsRoutes from './routes/GameResultsRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import startApp from './config/AppStartup.js';
import path from 'path';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);
app.use('/api/notifications', userNotificationRoutes);
app.use('/api/GameResults', gameResultsRoutes);

const currentFileUrl = new URL(import.meta.url);
const backendDir = path
    .dirname(decodeURI(currentFileUrl.pathname))
    .replace(/^\/([A-Za-z]:)/, '$1');
console.log('Backend directory:', backendDir);

// Use path.join instead of path.resolve to avoid duplicate drive letters
const frontendDir = path.join(backendDir, '../Frontend');
console.log('Frontend path:', frontendDir);

app.use(express.static(frontendDir));

app.get('/', async (req, res) => {
    console.log(bruh);
    console.log('start');
    const indexPath = path.join(frontendDir, 'index.html');
    console.log('Resolved index.html path:', indexPath);

    // Ensure the path is correct
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.log('Error sending file:', err);
        }
    });
});

startApp()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Error during application startup:', error);
        process.exit(1);
    });
