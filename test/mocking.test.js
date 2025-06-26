import chai from "chai";
import supertest from "supertest";
import mongoose from 'mongoose';

const expect = chai.expect;
const requester = supertest('http://localhost:8080'); //modo dev

describe('API Mock - /api/mocks', () => {

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

    // Mock
    describe('Test Mock', () => {
        
    //#region users

        it('Endpoint GET /api/mocks/mockingusers without quantity, must return the number of users created and a set list of 50 users', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.get('/api/mocks/mockingusers');
            expect(statusCode).to.equal(200);
            expect(ok).to.be.true;
            expect(_body.usersCreated).to.equal(50);
            expect(_body.payload.length).to.equal(50);
            expect(_body).to.deep.include({
                message: 'User Mock data generated and inserted successfully.'
            }); 
        });

        it('Endpoint GET /api/mocks/mockingusers with quantity = 5, must return the number of users created and a set list of 5 users', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.get('/api/mocks/mockingusers').query({quantity: 5});
            expect(statusCode).to.equal(200);
            expect(ok).to.be.true;
            expect(_body.usersCreated).to.equal(5);
            expect(_body.payload.length).to.equal(5); 
            expect(_body).to.deep.include({
                message: 'User Mock data generated and inserted successfully.'
            }); 
        });

        //Error Tests
        it('Endpoint GET /api/mocks/mockingusers with quantity = "coder", should return 400 and BAD_REQUEST if quantity is invalid', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.get('/api/mocks/mockingusers').query({ quantity: 'coder' });

            expect(statusCode).to.equal(400);
            expect(ok).to.be.false; 
            expect(_body).to.deep.include({
                error: 'BAD_REQUEST',
                message: 'Quantity must be a valid number, greater than 0.'
            });
        });

        it('Endpoint GET /api/mocks/mockingusers with quantity = 0, should return 400 and BAD_REQUEST if quantity is less than 1 (quantity: 0)', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.get('/api/mocks/mockingusers').query({ quantity: 0 });

            expect(statusCode).to.equal(400);
            expect(ok).to.be.false;
            expect(_body).to.deep.include({
                error: 'BAD_REQUEST',
                message: 'Quantity must be a valid number, greater than 0.'
            });
        });

    //#endregion
     
    //#region pets

        it('Endpoint GET /api/mocks/mockingpets without quantity, must return the number of pets created and a set list of 100 pets', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.get('/api/mocks/mockingpets');
            expect(statusCode).to.equal(200);
            expect(ok).to.be.true;
            expect(_body.petsCreated).to.equal(100);
            expect(_body.payload.length).to.equal(100); 
            expect(_body).to.deep.include({
                message: 'Pet Mock data generated and inserted successfully.'
            }); 
        });

        it('Endpoint GET /api/mocks/mockingpets with quantity = 50, must return the number of pets created and a set list of 50 pets', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.get('/api/mocks/mockingpets').query({quantity: 50});
            expect(statusCode).to.equal(200);
            expect(ok).to.be.true;
            expect(_body.petsCreated).to.equal(50);
            expect(_body.payload.length).to.equal(50);
            expect(_body).to.deep.include({
                message: 'Pet Mock data generated and inserted successfully.'
            });  
        });

        //Error Tests
        it('Endpoint GET /api/mocks/mockingpets with quantity = "coder", should return 400 and BAD_REQUEST if quantity is invalid', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.get('/api/mocks/mockingpets').query({ quantity: 'coder' });

            expect(statusCode).to.equal(400);
            expect(ok).to.be.false; 
            expect(_body).to.deep.include({
                error: 'BAD_REQUEST',
                message: 'Quantity must be a valid number, greater than 0.'
            });
        });

        it('Endpoint GET /api/mocks/mockingpets with quantity = 0, should return 400 and BAD_REQUEST if quantity is less than 1 (quantity: 0)', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.get('/api/mocks/mockingpets').query({ quantity: 0 });

            expect(statusCode).to.equal(400);
            expect(ok).to.be.false;
            expect(_body).to.deep.include({
                error: 'BAD_REQUEST',
                message: 'Quantity must be a valid number, greater than 0.'
            });
        });

    //#endregion

    //#region GenerateData

        it('Endpoint POST /api/mocks/generateData with no query (users: num, pets: num), must return a set list of 10 users and 10 pets (default)', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.post('/api/mocks/generateData');
            expect(statusCode).to.equal(200);
            expect(ok).to.be.true;
            expect(_body).to.deep.include({
                message: 'Mock data generated and inserted successfully.'
            });
            expect(_body.usersCreated).to.equal(10);
            expect(_body.users.length).to.equal(10);
            expect(_body.petsCreated).to.equal(10);
            expect(_body.pets.length).to.equal(10); 
        });

        it('Endpoint POST /api/mocks/generateData with query (users: 15, pets: 25), must return a set list of 15 users and 25 pets (default)', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.post('/api/mocks/generateData').query({users: 15, pets: 25});
            expect(statusCode).to.equal(200);
            expect(ok).to.be.true;
            expect(_body).to.deep.include({
                message: 'Mock data generated and inserted successfully.'
            });
            expect(_body.usersCreated).to.equal(15);
            expect(_body.users.length).to.equal(15);
            expect(_body.petsCreated).to.equal(25);
            expect(_body.pets.length).to.equal(25); 
        });

        //Error Tests
        it('Endpoint POST /api/mocks/generateData with query (users: "coder", pets: "coder"), should return 400 and BAD_REQUEST if quantity is invalid', async function () 
        {
            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.post('/api/mocks/generateData').query({ users: 'coder', pets: 'coder' });

            expect(statusCode).to.equal(400);
            expect(ok).to.be.false; 
            expect(_body).to.deep.include({
                error: 'BAD_REQUEST',
                message: 'Quantities for users and pets must be valid numbers.'
            });
        });
        
        it('Endpoint POST /api/mocks/generateData with query (users: 0, pets: 0), should return 400 and BAD_REQUEST if quantity is less than 1 (quantity: 0)', async function ()
        {

            this.timeout(5000);
            const { statusCode, ok, _body } = await requester.post('/api/mocks/generateData').query({ users: 0, pets: 0 }); 

            expect(statusCode).to.equal(400);
            expect(ok).to.be.false;
            expect(_body).to.deep.include({
                error: 'BAD_REQUEST',
                message: 'Quantities for users and pets must be valid numbers.'
            });
        });


        
    //#endregion
    
    });

})
