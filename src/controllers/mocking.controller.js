import { petsService } from "../services/index.js"
import { usersService } from "../services/index.js"
import { generatePet, generateUser } from '../utils/mocking.js';
import { AppError } from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const mockUsers = catchAsync(async (req, res, next) => 
{
	
	req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);

	let { quantity } = req.query;
	if (!quantity) quantity = 50; 
	quantity = parseInt(quantity);

	if (isNaN(quantity) || quantity < 1) 
	{
		throw new AppError("BAD_REQUEST", {
			message: "Quantity must be a valid number, greater than 0.",
		});
	}

	let users = [];
	for (let i = 0; i < quantity; i++) 
	{ 	
		users.push(await generateUser());
	}

	req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service - quantity: ${quantity}`); 
	const createdUsers = await usersService.createMany(users);

	res.setHeader("Content-Type", "application/json");
	req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - quantity: ${quantity}`); 
	return res.status(200).json({ status: "success", message: "User Mock data generated and inserted successfully.", usersCreated: createdUsers.length, payload: createdUsers}); 

});

export const mockPets = catchAsync(async (req, res, next) =>
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);

	let { quantity } = req.query;
	if (!quantity) quantity = 100; 
	quantity = parseInt(quantity);

	if (isNaN(quantity) || quantity < 1) 
	{
		throw new AppError("BAD_REQUEST", {
			message: "Quantity must be a valid number, greater than 0.",
		});
	}

    let pets = [];
    for(let i = 0; i < quantity; i++) 
	{
		pets.push(generatePet());
	}

    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip} calls service - quantity: ${quantity}`);
    const petsCreated = await petsService.createMany(pets);

    res.setHeader('Content-Type', 'application/json');
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully - quantity: ${quantity}`);
    return res.status(200).json({ status: "success", message: "Pet Mock data generated and inserted successfully.", petsCreated: petsCreated.length, payload: petsCreated}); 

});

export const generateData = catchAsync(async (req, res, next) => 
{

    req.logger.http(`Request: ${req.method} ${req.originalUrl} from ${req.ip}`);

    let { users: numUsers, pets: numPets } = req.query;

    if (!numUsers) numUsers = 10; 
    if (!numPets) numPets = 10;   

    numUsers = parseInt(numUsers);
    numPets = parseInt(numPets);

    if (isNaN(numUsers) || isNaN(numPets) || numUsers < 1 || numPets < 1) 
    {
      throw new AppError("BAD_REQUEST", 
      {
        message: "Quantities for users and pets must be valid numbers.",
      });
    }

    //Users
    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip}, Generating ${numUsers} mock users.`);
    let generatedUsers = [];
    for (let i = 0; i < numUsers; i++) {
      generatedUsers.push(await generateUser());
    }
    const createdUsers = await usersService.createMany(generatedUsers);
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip}, Successfully created ${createdUsers.length} users.`);

    //Pets
    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip}, Generating ${numPets} mock pets.`);
    let generatedPets = [];
    for (let i = 0; i < numPets; i++) {
      generatedPets.push(generatePet());
    }
    const createdPets = await petsService.createMany(generatedPets);
    req.logger.debug(`Request: ${req.method} ${req.originalUrl} from ${req.ip}, Successfully created ${createdPets.length} pets.`);

    res.setHeader("Content-Type", "application/json");
    req.logger.info(`Request: ${req.method} ${req.originalUrl} from ${req.ip} called successfully.`);
    return res.status(200).json({
      status: "success",
      message: "Mock data generated and inserted successfully.",
      usersCreated: createdUsers.length,
	  users: createdUsers,
      petsCreated: createdPets.length,
	  pets: createdPets
    });
   
});
