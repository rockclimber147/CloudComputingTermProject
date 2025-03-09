import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

export const app = express();
export const server = createServer(app);

app.use(express.json());
app.use(cors());
