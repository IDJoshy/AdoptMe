import { usersService } from "../services/index.js"
import { AppError } from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";


const getAllUsers = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const users = await usersService.getAll();
    if(!users || users.length === 0) throw new AppError("USERS_NOT_FOUND");
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - users: ${users.length}`);
    res.status(200).json({status:"success",payload:users})

});
const getUser = catchAsync(async (req, res, next) => 
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const userId = req.params.uid;
    if(!userId) throw new AppError("MISSING_REQUIRED_FIELDS");
    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service - userID: ${userId}`);
    const user = await usersService.getUserById(userId);
    if(!user) throw new AppError("USER_NOT_FOUND");
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - userID: ${userId}`);
    res.send({status:"success",payload:user})

});
const updateUser = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const updateBody = req.body;
    if(!updateBody) throw new AppError("MISSING_REQUIRED_FIELDS");
    const userId = req.params.uid;
    if(!userId) throw new AppError("MISSING_REQUIRED_FIELDS");
    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service - userID: ${userId}`);
    const user = await usersService.getUserById(userId);
    if(!user) throw new AppError("USER_NOT_FOUND");
    const result = await usersService.update(userId,updateBody);
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - userID: ${userId}`);
    res.status(200).json({status:"success",message:"User updated"})


});
const deleteUser = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const userId = req.params.uid;
    if(!userId) throw new AppError("MISSING_REQUIRED_FIELDS");
    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service - userID: ${userId}`);

    const userToDelete = await usersService.getUserById(userId);
    if(!userToDelete) throw new AppError("USER_NOT_FOUND");

    await usersService.delete(userToDelete._id);
    const result = await usersService.getUserById(userId);
    
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - userID: ${userId}`);
    res.status(200).json({status:"success", message:"User deleted"})

});
const uploadUserDocuments = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const userId = req.params.uid;
    if (!userId) {
        throw new AppError("MISSING_REQUIRED_FIELDS");
    }

    const files = req.files;

    if (!files || files.length === 0) {
        throw new AppError("NO_FILES_UPLOADED");
    }

    const user = await usersService.getUserById(userId);

    if (!user) {
        throw new AppError("USER_NOT_FOUND");
    }

    const newDocuments = files.map(file => ({
        name: file.originalname,
        reference: file.path
    }));

    const existingDocuments = Array.isArray(user.documents) ? user.documents : [];

    const updatedUser = await usersService.update(userId, {
        documents: [...existingDocuments , ...newDocuments]
    });

    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - Documents uploaded for userID: ${userId}`);

    res.status(200).json({
        status: "success",
        message: "Documents uploaded successfully",
        payload: updatedUser.documents
    });
});


export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    uploadUserDocuments,
}