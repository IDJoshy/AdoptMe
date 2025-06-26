import jwt from 'jsonwebtoken';
import { AppError } from './AppError.js';
import env from '../config/env.js';
import catchAsync from './catchAsync.js';

export const auth = catchAsync(async (req, res, next) => {

    const token = req.cookies[env.cookie_Name || 'EphemeralCookie'];
    if (!token) 
    {
        throw new AppError("USER_NOT_AUTHENTICATED", {
        message: "Not logged in.",
        });
    }

    const user = jwt.verify(token, env.jwt_secret || 'EphemeralSecret');
    req.user = user;

    next();

});