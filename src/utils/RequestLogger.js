export const requestLogger = (req, res, next) => 
{
    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    next();
};