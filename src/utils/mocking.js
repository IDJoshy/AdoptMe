import { fakerES as fa } from "@faker-js/faker";
import { createHash } from "../config/config.js";

export const generatePet = () =>
{
    let name = fa.person.firstName();
    let specie = fa.animal.type();
    let birthDate = fa.date.past();
    let adopted = false;
    return {name,specie,birthDate,adopted};
}

function Random(min, max) 
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export const generateUser = async () => 
{
	let first_name = fa.person.firstName();
	let last_name = fa.person.lastName();
	let email = fa.internet.email();
	const password = await createHash("coder123"); 
	let role = Random(0, 1) ? "admin" : "user"; 
	let pets = [];
	let documents = [];
	let last_connection = "";

	return { first_name, last_name, email, password, role, pets, documents, last_connection };
};