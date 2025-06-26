import { LoggerControllerError } from "./LoggerControllerError.js";
import { AppError } from "./AppError.js";

export default function catchAsync(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next))
            .catch(error => 
            {
                if (error instanceof AppError) 
                {
                    LoggerControllerError({ req, error });
                    const responseBody = 
                    {
                        error: error.code,
                        message: error.message,
                    };
                
                    if (Object.keys(error.etc || {}).length > 0) 
                    {
                        const filteredEtc = { ...error.etc };
                        delete filteredEtc.message;

                        if (Object.keys(filteredEtc).length > 0) {
                            responseBody.details = filteredEtc;
                        }
                    }

                    return res.status(error.status).json(responseBody);
                }

                req.logger?.fatal(`Unexpected error: ${error.message}`);
                return res.status(500).json({
                    error: 'UNEXPECTED_ERROR',
                    message: 'An unknown error has occurred'
                });
            });
    };
}