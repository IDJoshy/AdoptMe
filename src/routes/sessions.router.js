import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';
import { auth } from '../utils/auth.js';

const router = Router();

router.post('/register',sessionsController.register);
router.post('/login',sessionsController.login);
router.get('/current', auth ,sessionsController.current);
router.post('/unprotectedLogin',sessionsController.unprotectedLogin);
router.get('/unprotectedCurrent',sessionsController.unprotectedCurrent);
router.get('/logout', auth, sessionsController.logout);

export default router;