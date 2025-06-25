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
                    //req.logger?.error(`[${error.code}] ${error.message}`);
                    return res.status(error.status).json({
                        error: error.code,
                        message: error.message,
                        ...(Object.keys(error.etc || {}).length > 0 && { details: error.etc })
                    });
                }

                req.logger?.fatal(`Unexpected error: ${error.message}`);
                return res.status(500).json({
                    error: 'UNEXPECTED_ERROR',
                    message: 'An unknown error has occurred'
                });
            });
    };
}