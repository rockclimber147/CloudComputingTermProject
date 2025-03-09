import { Server } from 'socket.io';
import { server } from '../config/Server.js';

export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
