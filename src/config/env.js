import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mode = process.env.NODE_ENV || 'prod';

const envFile = mode === 'prod' ? '.env.prod' : '.env.dev';
const envPath = path.resolve(__dirname, `../../${envFile}`); 

dotenv.config({ path: envPath });

export default {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    db_name: process.env.DB_NAME,
    node_env: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET,
    cookie_Name: process.env.COOKIE_NAME 
};