export function LoggerControllerError({ req, error }) {
    req.logger?.error(
        `[${req.method}] ${req.originalUrl} - Error: ${error?.code} - Reason: ${error?.message}`
    );
    
    if (error?.stack) {
        req.logger?.debug(`Stack Trace: ${error.stack}`);
    }
}