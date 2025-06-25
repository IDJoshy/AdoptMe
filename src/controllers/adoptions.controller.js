import { adoptionsService, petsService, usersService } from "../services/index.js"
import { AppError } from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const getAllAdoptions = catchAsync(async (req, res, next) =>
{   
    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);

    const result = await adoptionsService.getAll();
        
    if (!result || result.length === 0) 
    {
        throw new AppError("ADOPTIONS_NOT_FOUND");
    };

    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - Retrieved ${result.length} items`);

    res.status(200).json({
        status: "success",
        payload: result
    });
});

const getAdoption = catchAsync(async (req, res, next) =>
{
    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const adoptionId = req.params.aid;
    if(!adoptionId) throw new AppError("MISSING_REQUIRED_FIELDS");

    const adoption = await adoptionsService.getBy({_id:adoptionId})
    if(!adoption) throw new AppError("ADOPTION_NOT_FOUND");

    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - adoptionID: ${adoptionId}`);
    res.status(200).json(
    {
        status:"success",payload:adoption
    }
    );
});

const createAdoption = catchAsync(async (req, res, next) =>
{
    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const {uid,pid} = req.params;
    if(!uid||!pid) throw new AppError("MISSING_REQUIRED_FIELDS");

    const user = await usersService.getUserById(uid);
    if(!user) throw new AppError("USER_NOT_FOUND");
    const pet = await petsService.getBy({_id:pid});
    if(!pet) throw new AppError("PET_NOT_FOUND");
    if(pet.adopted) throw new AppError("ADOPTION_ALREADY_EXISTS");

    user.pets.push({ _id: pet._id });
    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service - petID: ${pet._id} - userID: ${user._id}`);
    await usersService.update(user._id,{pets:user.pets})
    await petsService.update(pet._id,{adopted:true,owner:user._id})
    await adoptionsService.create({owner:user._id,pet:pet._id})

    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - petID: ${pet._id} - userID: ${user._id}`);
    res.status(200).json(
    {
        status:"success",
        message:"Pet adopted successfully"
    }
    )

});

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}