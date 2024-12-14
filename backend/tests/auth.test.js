const request = require('supertest');
const app = require('../app');
const User = require('../models/User'); // Import the User model

const mongoose = require('mongoose');

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Authentication Endpoints', () => {
    // Clean up after each test
    afterEach(async () => {
        await User.deleteOne({ email: 'test@example.com' });
    });

   

    it('should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            roleName: 'Viewer',
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
      
    });

    it('should return 400 if required fields are missing', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 400 if email is invalid', async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: 'Test User',
            email: 'invalid-email',
            password: 'password123',
            roleName: 'Viewer',
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid email format');
    });
});
