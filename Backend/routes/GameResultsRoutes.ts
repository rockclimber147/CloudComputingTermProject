import express, { Request, Response } from 'express';
import { gameResultsRepository } from '../config/RepositoryInit.js';
import { handleError } from '../modules/ErrorHandling.js';


const router = express.Router();


export default router;