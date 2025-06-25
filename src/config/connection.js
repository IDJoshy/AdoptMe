import mongoose from "mongoose";
import { AppError, EndAppError } from '../utils/AppError.js';
import logger from "../utils/GlobalLogger.js";

mongoose.set('strictQuery', false);


const connection = async (url, dbName) => 
{
    try 
    {
        await mongoose.connect(url, { dbName });
        logger.info(`Connected to Cluster at ${url}, database: ${dbName}`);
    } 
    catch (err) 
    {
        const e = new AppError("SERVICE_UNAVAILABLE", {
            message: "Error connecting to MongoDB Cluster",
            original: err.message
        });
        logger.fatal(`[${e.code}] ${e.message}`);
        EndAppError();
    }
};

export default connection;
