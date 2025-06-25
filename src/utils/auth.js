import jwt from 'jsonwebtoken';
import { AppError } from './AppError.js';
import env from '../config/env.js';

export const auth = (req, res, next) => {
    try {
        const token = req.cookies[env.cookie_Name || 'EphemeralCookie'];
        if (!token) throw new AppError("USER_NOT_AUTHENTICATED");

        const user = jwt.verify(token, env.jwt_secret || 'EphemeralSecret');
        req.user = user;

        next();
    } catch (error) {
        next(new AppError("USER_NOT_AUTHENTICATED"));
    }
};