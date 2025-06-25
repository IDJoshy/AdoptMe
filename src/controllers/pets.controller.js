import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import { __dirname } from "../config/config.js";
import { AppError } from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const getAllPets = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);

    const pets = await petsService.getAll();
    if(!pets || pets.length === 0) throw new AppError("PETS_NOT_FOUND");

    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service successfully - quantity: ${pets.length}`);
    res.status(200).json({status:"success",payload:pets})

});

const getPet = catchAsync(async (req, res, next) =>
{
    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const petId = req.params.pid;
    if(!petId) throw new AppError("MISSING_REQUIRED_FIELDS");
    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service - petID: ${petId}`);
    const pet = await petsService.getPetById(petId);
    if(!pet) throw new AppError("PET_NOT_FOUND");
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - petID: ${petId}`);
    res.status(200).json({status:"success",payload:pet})
});

const createPet = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);

    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) throw new AppError("MISSING_REQUIRED_FIELDS");

    const pet = PetDTO.getPetInputFrom({name,specie,birthDate});

    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service - pet: ${JSON.stringify(pet)}`);
    const result = await petsService.create(pet);

    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - petID: ${result._id}`);
    res.status(200).json({status:"success", message:"Pet created", payload:result})

});

const updatePet = catchAsync(async (req, res, next) =>
{
    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    if(!petId||!petUpdateBody) throw new AppError("MISSING_REQUIRED_FIELDS");

    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip}, calls service - petID: ${petId} - petUpdateBody: ${JSON.stringify(petUpdateBody)}`);

    const result = await petsService.update(petId,petUpdateBody);
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - petID: ${petId}`);
    res.status(200).json({status:"success", message:"Pet updated", payload:result})
});

const deletePet = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const petId = req.params.pid;
    if(!petId) throw new AppError("MISSING_REQUIRED_FIELDS");
    const result = await petsService.delete(petId);
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - petID: ${petId}`);
    res.status(200).json({status:"success", message:"Pet deleted"})

});

const createPetWithImage = catchAsync(async (req, res, next) =>
{
    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);
    const file = req.file;

    const {name, specie, birthDate } = req.body;
    if(!name||!specie||!birthDate) throw new AppError("MISSING_REQUIRED_FIELDS");
    
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image:`${__dirname}/../public/img/${file.filename}`
    });

    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service - pet: ${JSON.stringify(pet)}`);
    const result = await petsService.create(pet);

    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - petID: ${result._id}`);
    res.status(200).json({status:"success", message:"Pet created", payload:result})
});


export default {
    getAllPets,
    getPet,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage,
}