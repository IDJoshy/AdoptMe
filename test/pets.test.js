import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import path from 'path';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Pets API - /api/pets', () => 
{
    let createdPetIDs = [];

    before(async () => 
    {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://localhost:27017/AdoptMe');
    });

    after(async () => 
    {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('POST /api/pets, should create a new pet', async function () 
    {
        this.timeout(5000);

        const petMock = {
            name: "Aragorn",
            specie: "Felis Catus",
            birthDate: "2020-01-15"
        };

        const { statusCode, body } = await requester.post('/api/pets').send(petMock);

        expect(statusCode).to.equal(200);
        expect(body).to.have.property('status', 'success');
        expect(body).to.have.property('payload');
        expect(body.payload).to.have.property('_id');

        createdPetIDs.push(body.payload._id);
        console.log(body.payload);
    });

    it('GET /api/pets, should return a list of all pets', async function () 
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.get('/api/pets');

        expect(statusCode).to.equal(200);
        expect(body).to.have.property('status', 'success');
        expect(body).to.have.property('payload');
        expect(body.payload).to.be.an('array');
        expect(body.payload.length).to.be.greaterThan(0);
    });

    it('GET /api/pets/:pid, should return a specific pet', async function () 
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.get(`/api/pets/${createdPetIDs[0]}`);

        expect(statusCode).to.equal(200);
        expect(body).to.have.property('status', 'success');
        expect(body.payload).to.have.property('_id', createdPetIDs[0]);
    });

    it('PUT /api/pets/:pid, should update a pet', async function () 
    {
        this.timeout(5000);

        const { statusCode, body } = await requester.put(`/api/pets/${createdPetIDs[0]}`).send({
            name: "Haru",
            specie: "Felis Catus"
        });

        expect(statusCode).to.equal(200);
        expect(body).to.have.property('status', 'success');
        expect(body.payload.name).to.equal('Haru');
    });

    it('DELETE /api/pets/:pid, should delete a pet', async function () 
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.delete(`/api/pets/${createdPetIDs[0]}`);

        expect(statusCode).to.equal(200);
        expect(body).to.have.property('status', 'success');
    });

    it('GET /api/pets/:pid, should fail if pet does not exist', async function () 
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.get('/api/pets/64c115cb0c23bc1a2fcb4abc');

        expect(statusCode).to.equal(404);
        expect(body).to.have.property('error', 'PET_NOT_FOUND');
    });

    it('GET /api/pets/:pid, should fail with invalid ID format', async function () 
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.get('/api/pets/invalidID');

        expect(statusCode).to.equal(400);
        expect(body).to.deep.include({
            error: 'INVALID_MONGO_ID',
            message: 'Invalid pet ID format'
        });
    });

    it('GET /api/pets, should return PETS_NOT_FOUND if db is empty', async function () 
    {
        this.timeout(5000);
        await mongoose.connection.db.dropCollection('pets');

        const { statusCode, body } = await requester.get('/api/pets');

        expect(statusCode).to.equal(404);
        expect(body).to.have.property('error', 'PETS_NOT_FOUND');
    });

    it('POST /api/pets/image, should create a pet with an image', async function () 
    {
        this.timeout(5000);
        const filePath = path.join(process.cwd(), 'test', 'Aragorn.png');

        const res = await requester.post('/api/pets/withimage')           
            .field('name', 'Aragorn')
            .field('specie', 'Felis Catus')
            .field('birthDate', '2020-01-15')
            .attach('petImage', filePath);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('payload');
        expect(res.body.payload).to.have.property('image');

        console.log(res.body.payload);
    });

});