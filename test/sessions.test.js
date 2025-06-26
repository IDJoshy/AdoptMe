import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Sessions API - /api/sessions', () => 
{
    const userMock = {
        first_name: "Test",
        last_name: "User",
        email: "testuser@example.com",
        password: "password123"
    };

    let authCookie;

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

    it('POST /api/sessions/register, should register a new user', async function () 
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.post('/api/sessions/register').send(userMock);

        expect(statusCode).to.equal(201);
        expect(body).to.have.property('status', 'success');
        expect(body).to.have.property('payload');
    });

    it('POST api/sessions/register, should fail if user already exists', async function () {
        this.timeout(5000);
        const { statusCode, body } = await requester.post('/api/sessions/register').send(userMock);

        expect(statusCode).to.equal(409); 
        expect(body).to.deep.include({
            error: 'USER_ALREADY_EXISTS',
            message: 'User already exists in the database, cannot create a new user with the same email'
        });
    });

    it('POST api/sessions/login, should login successfully and set EphemeralCookie', async function () 
    {
        this.timeout(5000);
        const res = await requester.post('/api/sessions/login').send(
        {
            email: userMock.email,
            password: userMock.password
        });

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        const cookies = res.headers['set-cookie'];
        expect(cookies).to.be.an('array').that.is.not.empty;

        authCookie = cookies[0].split(';')[0];
        expect(authCookie).to.match(/^EphemeralCookie=/);
    });

    it('POST /api/sessions/login, should fail with wrong credentials', async function ()
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.post('/api/sessions/login').send({ 
            email: userMock.email, 
            password: 'coder_123' 
        });

        expect(statusCode).to.equal(401);
        expect(body).to.deep.include({
            error: 'USER_WRONG_CREDENTIALS',
            message: 'Incorrect email or password.'
        });
    });

    it('GET /api/sessions/current, should return the current session user', async function () 
    {
        this.timeout(5000);
        const res = await requester.get('/api/sessions/current').set('Cookie', authCookie);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body.payload).to.include.keys('email', 'role', 'name');
        expect(res.body.payload.email).to.equal(userMock.email);
    });

    it('GET /api/sessions/current, should fail if there is no cookie', async function () 
    {
        this.timeout(5000);
        const { statusCode, body } = await requester.get('/api/sessions/current');

        expect(statusCode).to.equal(401);
        expect(body).to.deep.include({
            error: 'USER_NOT_AUTHENTICATED',
            message: 'Not logged in.'
        });
    });

    it('POST /api/sessions/unprotectedLogin, should return token in cookie', async function ()
    {
        this.timeout(5000);
        const res = await requester.post('/api/sessions/unprotectedLogin').send({
            email: userMock.email,
            password: userMock.password
        });

        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('success');
        const cookies = res.headers['set-cookie'];
        expect(cookies[0]).to.include('unprotectedCookie');
    });

    it('GET /api/sessions/unprotectedCurrent, should return user from unprotected cookie', async function ()
    {
        this.timeout(5000);
        const login = await requester.post('/api/sessions/unprotectedLogin').send(
        {
            email: userMock.email,
            password: userMock.password
        });

        const cookies = login.headers['set-cookie'];
        expect(cookies).to.be.an('array').that.is.not.empty;
        const cookieU = cookies[0].split(';')[0];

        const res = await requester
            .get('/api/sessions/unprotectedCurrent')
            .set('Cookie', cookieU);

        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.payload.email).to.equal(userMock.email);
    });

    it('GET /api/sessions/logout, should clear the session cookie', async function ()
    {
        const res = await requester.get('/api/sessions/logout').set('Cookie', authCookie);

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.deep.include({
            status: 'success',
            message: 'Logged out'
        });

        const cleared = res.headers['set-cookie'][0];
        expect(cleared).to.include('EphemeralCookie=;');
    });
});