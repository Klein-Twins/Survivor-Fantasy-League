const request = require('supertest');
const app = require('../index'); // Adjust the path as needed
const db = require('../src/config/db');
const User = require('../src/models/User'); // Adjust the path as needed
const Password = require('../src/models/Password');
describe('Authentication Tests', () => {

    // Signup Tests
    describe('Signup Tests', () => {
        it('should sign up a new user', async () => {
            const response = await request(app)
                .post('/api/auth/signup') // Make sure this is correct according to your routes
                .send({ USER_NAME: 'testuser', PASSWORD: 'Test@123' }); // Use PASSWORD not password
        
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User created successfully');
        });
    });

    // Login Tests
    describe('Login Tests', () => {

    });
});