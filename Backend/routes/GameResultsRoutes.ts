import express, { Request, Response } from 'express';
import { GameResultsRepository } from '../repositories/GameResultsRepository.js';
import { handleError } from '../modules/ErrorHandling.js';


const router = express.Router();


export default router;