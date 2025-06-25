import { createBaseLogger } from './Logger.js';
import env from '../config/env.js';

const logger = createBaseLogger(env.node_env);

export default logger;