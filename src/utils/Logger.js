import winston from "winston";
import path from "path";
import logger from "./GlobalLogger.js";

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: { 
        
        fatal: "bgRed white",
        error: "red",
        warning: "yellow",
        info: "green",
        http: "cyan",
        debug: "blue"
    }
};

export const createLoggerInstance = (logLevel) => winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: logLevel,
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevels.colors }),
                winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: path.join(process.cwd(), 'logs', 'error.log'),
            level: 'error',
            format: winston.format.combine( 
                winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.simple()
            )
        })
    ]
});

export const createBaseLogger = (env) => 
{
    const logLevel = env === 'prod' ? 'info' : 'debug';
    return createLoggerInstance(logLevel);
};

export const addLogger = (req, res, next) => 
{
    req.logger = logger;
    //req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleString()}`);
    next();
};