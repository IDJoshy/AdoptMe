import errors from "./ErrorDictionary.js";

export class AppError extends Error
{
    constructor(code, etc = {}) 
    {
        const errorDictionaryEntry = errors[code];

        if (!errorDictionaryEntry)
        {
            super('An unknown error has occurred.');
            this.code = 'UNKNOWN_ERROR';
            this.status = 500;
        }
        else
        {
            const finalMessage = etc.message || errorDictionaryEntry.message;
            super(finalMessage); 
            
            this.code = errorDictionaryEntry.code;
            this.status = errorDictionaryEntry.status;
        }

        this.etc = etc;
        Error.captureStackTrace(this, this.constructor);
    }
}


export const EndAppError = () => 
{
    process.exit(1);
}