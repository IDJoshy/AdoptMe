import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../config/config.js";
import env from "../config/env.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { AppError } from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";


const register = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);

    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password)
    {
        throw new AppError("MISSING_REQUIRED_FIELDS", {
            message: "Not all required fields were provided.",
        });
    }

    const exists = await usersService.getUserByEmail(email);
    if (exists)
    {
        throw new AppError("USER_ALREADY_EXISTS", {
			message: "User already exists in the database, cannot create a new user with the same email",
		});
    }

    const hashedPassword = await createHash(password);
    const user = {
        first_name,
        last_name,
        email,
        password: hashedPassword
    }

    let result = await usersService.create(user);
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - userID: ${result._id}`);
    res.status(201).json({ status: "success", payload: result._id });

});

const login = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const { email, password } = req.body;
    if (!email || !password) throw new AppError("MISSING_REQUIRED_FIELDS");
    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service - email: ${email}`);

    const user = await usersService.getUserByEmail(email);
    if(!user) 
    {
        throw new AppError("USER_WRONG_CREDENTIALS", {
			message: "Incorrect email or password.",
		});
    }

    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword)
    {
        throw new AppError("USER_WRONG_CREDENTIALS", {
			message: "Incorrect email or password.",
		});
    }

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, env.jwt_secret || 'EphemeralSecret',{expiresIn:"1h"});
    
    //Actualizar last_connection
    const currentDate = new Date().toString();
    await usersService.update(user._id, { last_connection: currentDate });

    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - userID: ${user._id}`);
    res.cookie(env.cookie_Name || "EphemeralCookie",token,{maxAge:3600000}).send({status:"success",message:"Logged in"})
});

const current = catchAsync(async (req, res, next) =>
{
    const cookieName = env.cookie_Name || "EphemeralCookie";
    const cookie = req.cookies[cookieName];

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);

    if (!cookie) 
    {
        throw new AppError("USER_NOT_AUTHENTICATED", {
            message: "Not logged in.",
        });
    }

    let user;
    try 
    {
        user = jwt.verify(cookie, env.jwt_secret || 'EphemeralSecret');
    } 
    catch 
    {
        throw new AppError("USER_NOT_AUTHENTICATED", {
            message: "Not logged in.",
        });
    }

    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - userID: ${user._id}`);
    return res.status(200).json({ status: "success", payload: user });
});

const unprotectedLogin = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const { email, password } = req.body;
    if (!email || !password) throw new AppError("MISSING_REQUIRED_FIELDS");
    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service to authenticate user - email: ${email}`);
    const user = await usersService.getUserByEmail(email);
    if(!user) throw new AppError("USER_WRONG_CREDENTIALS");

    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) throw new AppError("USER_WRONG_CREDENTIALS");

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, env.jwt_secret || 'EphemeralSecret', { expiresIn: "1h" });

    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - userID: ${user._id}`);

    res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" });

});

const unprotectedCurrent = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie, env.jwt_secret || 'EphemeralSecret');
    if(user)
    {
        req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - userID: ${user._id}`);
        return res.status(200).json({status:"success",payload:user})
    }
});

const logout = catchAsync(async (req, res, next) => 
{
    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    if (!req.user) return next(new AppError("USER_NOT_AUTHENTICATED"));

    const currentDate = new Date().toString();
    await usersService.update(req.user._id, { last_connection: currentDate });
    res.clearCookie(env.cookie_Name || "EphemeralCookie").send({ status: "success", message: "Logged out" });
    req.logger.info(`User ${req.user._id} logged out successfully.`);
});

export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent,
    logout
}