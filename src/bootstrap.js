import { Command, Option } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();
program.addOption(
    new Option('-m, --mode <type>', 'environment')
        .choices(['dev', 'prod'])
        .default('prod')
);
program.parse();
const opts = program.opts();

process.env.NODE_ENV = opts.mode;


const loadEnv = (mode = 'prod') => {
    const envFile = mode === 'prod' ? '.env.prod' : '.env.dev';
    const envPath = path.resolve(__dirname, envFile);
    dotenv.config({ path: envPath });
};

loadEnv(opts.mode);

export const envMode = opts.mode;