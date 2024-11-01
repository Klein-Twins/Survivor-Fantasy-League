const request = require('supertest');
const app = require('../index'); // Adjust the path as needed
const db = require('../src/config/dbConfig');
const User = require('../src/models/User'); // Adjust the path as needed
const Password = require('../src/models/Password');
describe('Authentication Tests', () => {

    afterEach(async () => {
        
    })

    // Signup Tests
    describe('Signup Tests', () => {
        it('should sign up a new user', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({ USER_NAME: 'testuser1', PASSWORD: 'Test@123' }); // Use PASSWORD not password
        
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User created successfully');

            await User.destroy({ where: { USER_NAME: 'testuser1' }});
        });
    });

    // Login Tests
    describe('Login Tests', () => {

    });
});