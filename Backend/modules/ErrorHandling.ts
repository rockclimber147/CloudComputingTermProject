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
    if (error instanceof ErrorWithStatusCode) {
        res.status(error.statusCode).json({ error: error.message });
    } else if (error instanceof Error) {
        // Handle generic errors
        res.status(500).json({ error: error.message });
    } else {
        // Handle unexpected errors
        res.status(500).json({ error: 'Unknown error occurred' });
    }
};

export { ErrorWithStatusCode, handleError}