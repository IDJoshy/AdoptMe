import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Adoptions API - /api/adoptions', () => 
{
    let createdUserId;
    let createdPetId;
    let createdAdoptionId;

    before(async function () 
    {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://localhost:27017/AdoptMe');

        this.timeout(5000);

        const userRes = await requester.post('/api/sessions/register').send({
            first_name: "Coder",
            last_name: "House",
            email: "coder@example.com",
            password: "adopt1234"
        });
        expect(userRes.statusCode).to.equal(201);
        createdUserId = userRes.body.payload;
        console.log(createdUserId);
        
        this.timeout(5000);
        const petRes = await requester.post('/api/pets').send({
            name: "Rocky",
            specie: "Canis Lupus",
            birthDate: "2023-06-01T00:00:00.000Z"
        });
        expect(petRes.statusCode).to.equal(200);
        createdPetId = petRes.body.payload._id;
        console.log(createdPetId);
    });

    after(async () => 
    {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('POST /api/adoptions/:uid/:pid, should create an adoption successfully', async function () 
    {
        this.timeout(5000);
        const res = await requester.post(`/api/adoptions/${createdUserId}/${createdPetId}`);
        
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('message', 'Pet adopted successfully');

        // Confirmar adopción en la base de datos
        const getRes = await requester.get('/api/adoptions');
        expect(getRes.statusCode).to.equal(200);
        expect(getRes.body.payload).to.be.an('array');
        expect(getRes.body.payload.length).to.equal(1);
        
        createdAdoptionId = getRes.body.payload[0]._id;

        console.log(getRes.body.payload[0]);
    });

    it('POST /api/adoptions/:uid/:pid, should fail if pet is already adopted', async function () 
    {
        this.timeout(5000);
        const res = await requester.post(`/api/adoptions/${createdUserId}/${createdPetId}`);

        expect(res.statusCode).to.equal(409);
        expect(res.body).to.have.property('error', 'ADOPTION_ALREADY_EXISTS');
    });

    it('GET /api/adoptions/:aid, should return specific adoption', async function () 
    {
        this.timeout(5000);
        const res = await requester.get(`/api/adoptions/${createdAdoptionId}`);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body.payload).to.have.property('owner');
        expect(res.body.payload).to.have.property('pet');
    });

    it('GET /api/adoptions/:aid, should fail with invalid ID', async function () 
    {
        this.timeout(5000);
        const res = await requester.get(`/api/adoptions/invalidID123`);

        expect(res.statusCode).to.equal(404);
        expect(res.body).to.have.property('error', 'ADOPTION_NOT_FOUND');
    });

    it('GET /api/adoptions, should return all adoptions', async function () 
    {
        this.timeout(5000);
        const res = await requester.get('/api/adoptions');

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body.payload).to.be.an('array');
        expect(res.body.payload.length).to.be.greaterThan(0);
    });
});