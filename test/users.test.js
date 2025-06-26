import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import path from 'path';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Users API - /api/users', () => 
{
    const userMock = {
        first_name: "Test",
        last_name: "User",
        email: "testuser@example.com",
        password: "password123"
    };

    let createdUserIDs = [];
    let userbeforeUpdate = {};

    before(async () => 
    {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://localhost:27017/AdoptMe'); 
        const { statusCode, body } = await requester.get('/api/mocks/mockingusers').query({quantity: 5});
    });

    after(async () => 
    {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('GET /api/users, should return a list of all users (test set to 5)', async function () 
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.get('/api/users');

        expect(statusCode).to.equal(200);
        expect(body).to.have.property('status', 'success');
        expect(body).to.have.property('payload');  
        expect(body.payload.length).to.equal(5);

        for (let i = 0; i < body.payload.length; i++)
        {
            createdUserIDs.push(body.payload[i]._id);
        }

        console.log(body.payload);
    });

    it('GET /api/users/{uid}, should return a specific user', async function () 
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.get(`/api/users/${createdUserIDs[0]}`);

        expect(statusCode).to.equal(200);
        expect(body).to.have.property('status', 'success');
        expect(body).to.have.property('payload');
        expect(body.payload._id).to.equal(createdUserIDs[0]);
        userbeforeUpdate = body.payload;
        console.log(body.payload);
    });

    it('GET /api/users/{uid}, should fail if user does not exist', async function ()
    {
        this.timeout(5000);
        const fakeUID = '64c115cb0c23bc1a2fcb4abc'; 

        const { statusCode, body } = await requester.get(`/api/users/${fakeUID}`);

        expect(statusCode).to.equal(404);
        expect(body).to.have.property('error', 'USER_NOT_FOUND');
    });

    it('GET /api/users/{uid}, should fail with invalid uid, return 404 and USER_NOT_FOUND', async function () 
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.get('/api/users/invalidID123');

        expect(statusCode).to.equal(404);
        expect(body).to.have.property('error');
        expect(body).to.have.property('message');
        expect(body).to.deep.include({
            error: 'USER_NOT_FOUND',
            message: 'User not found in database, be sure of the user ID'
        });

        console.log("GET /api/users/{invalidID123}: " + statusCode + " " + body.message);
    });

    it('PUT /api/users/{uid}, should update first_name and last_name of a specific user (first one created)', async function () 
    {
        this.timeout(5000);

        const { statusCode, body } = await requester.put(`/api/users/${createdUserIDs[0]}`).send({
            first_name: "Updated",
            last_name: "User"
        });
        
        expect(statusCode).to.equal(200);
        expect(body).to.have.property('status', 'success');
        expect(body).to.have.property('payload');
        expect(body.payload.first_name).to.equal('Updated');

        console.log(userbeforeUpdate);
        console.log(body.payload[0]);

    });

    it('POST /api/users/:uid/documents, should upload user documents, and return the documents array', async function () 
    {
        this.timeout(5000);
        const filePath = path.join(process.cwd(), 'test' ,'dummy.pdf');

        const res = await requester.post(`/api/users/${createdUserIDs[0]}/documents`).attach('documents', filePath);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body.payload).to.be.an('array');

        console.log(res.body.payload);
    });

    it('DELETE /api/users/{uid}, should delete a specific user, and return the deleted user (set to delete all mocked users)', async function () 
    {
        this.timeout(5000);

        for (let i = 0; i < createdUserIDs.length; i++)
        {
            const { statusCode, body } = await requester.delete(`/api/users/${createdUserIDs[i]}`);

            expect(statusCode).to.equal(200);
            expect(body).to.have.property('status', 'success');
            expect(body).to.have.property('payload');
            expect(body.payload._id).to.equal(createdUserIDs[i]);
        }
    });

    it('GET /api/users, should return error if there are no users in database', async function () 
    {
        this.timeout(5000);
    
        await mongoose.connection.db.dropCollection('users');

        const { statusCode, body } = await requester.get('/api/users');

        expect(statusCode).to.equal(404);
        expect(body).to.have.property('error', 'USERS_NOT_FOUND');
    });

});