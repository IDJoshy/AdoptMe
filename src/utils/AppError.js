import errors from "./ErrorDictionary.js";

export class AppError extends Error
{
    constructor(code, etc = {}) 
    {
        const errorDictionary = errors[code] || 
        {
            code: 'UNKNOWN_ERROR',
            message: 'An unknown error has occurred',
            status: 500
        };

        super(errorDictionary.message);
        this.code = errorDictionary.code || 'UNKNOWN_ERROR';
        this.status = errorDictionary.status || 500;
        this.etc = etc;
    }
}

export const EndAppError = () => 
{
    process.exit(1);
}