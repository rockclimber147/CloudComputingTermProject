import { Response } from 'express';

class ErrorWithStatusCode extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

const handleError = (res: Response, error: unknown): void => {
    // Check if the error is an instance of ErrorWithStatusCode
    console.log(error)
    if (error instanceof ErrorWithStatusCode) {
        res.status(error.statusCode).json({ error: error.message });
    } else {
        res.status(500).json({ error: 'Unknown error occurred' });
    }
}


export { ErrorWithStatusCode, handleError}