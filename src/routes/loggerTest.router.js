import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    req.logger.debug('Logger Test: This is a DEBUG message.');
    req.logger.http('Logger Test: This is an HTTP message.');
    req.logger.info('Logger Test: This is an INFO message.');
    req.logger.warning('Logger Test: This is a WARNING message.');
    req.logger.error('Logger Test: This is an ERROR message.');
    req.logger.fatal('Logger Test: This is a FATAL message.'); 
    
    req.logger.error('Logger Test: Error with metadata.', {
        route: req.path,
        method: req.method,
        userId: req.user ? req.user.id : 'anonymous'
    });

    res.status(201).send('Logger Test');
});

export default router;