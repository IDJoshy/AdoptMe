import express from 'express';
import cookieParser from 'cookie-parser';
import compress from "express-compression";
import helmet from "helmet";

import env from './config/env.js';
import connection from "./config/connection.js";
import logger from './utils/GlobalLogger.js';
import { addLogger } from './utils/Logger.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

// Routers
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import loggerTestRouter from './routes/loggerTest.router.js';

const app = express();
const PORT = env.port;

connection(env.mongo_url, env.db_name);

//#region Swagger
const swaggerOptions = 
{
    definition:
    {
        openapi:"3.0.0",
        info:
        {
            title:"AdoptMe API Documentation",
            version:"1.0.0",
            description:"Documentation for AdoptMe API, developed by EphemeralJosh for the Full Stack Web Development Bootcamp.",
        }
    },
    apis: ["./src/docs/*.yaml"]
}

const specs = swaggerJsdoc(swaggerOptions);
//#endregion

app.use(compress());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(addLogger);
app.use(helmet.hidePoweredBy());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/api/loggerTest', loggerTestRouter);

app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use('*', (req, res) => res.status(404).json({error: 'Not found'}));

app.listen(PORT, () => 
{
    logger.debug(`[APP_START] DEBUG - NODE_ENV loaded: ${env.node_env}`);
    logger.debug(`[APP_START] HTTP - PID: ${process.pid}`);
    logger.info(`[APP_START] INFO - Server listening on port ${PORT}`);    
});