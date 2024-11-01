const request = require('supertest');
const app = require('../index'); // Adjust the path as needed
const db = require('../src/config/dbConfig');
const User = require('../src/models/User'); // Adjust the path as needed
const Password = require('../src/models/Password');

const { sequelize } = require('../src/config/dbConfig');

const PORT = process.env.PORT || 3000;
describe('Authentication Tests', () => {

    beforeAll(async () => {
        try {
          await sequelize.sync({ force: true }); // Sync database
          console.log("Database & tables created!");
      
          app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
          });
        } catch (error) {
          console.error("Failed to sync database and start server:", error);
        }
      })

    // Signup Tests
    describe('Signup Tests', () => {
        
        it('should sign up a new user', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'test@mail.com', username: 'testusername1', password: 'Test@123' }); 
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User created successfully');
        
            await User.destroy({ where: { USER_NAME: 'testusername1' } });
        });

        it('should return 400 if username is already used for an account', async () => {
            await request(app)
                .post('/api/auth/signup')
                .send({ email: 'test@mail.com', username: 'testusername1', password: 'Test@123' }); // Use PASSWORD not password

            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'test2@mail.com', username: 'testusername1', password: 'Test@123' }); // Use PASSWORD not password
        
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'User name is already taken');

            await User.destroy({ where: { USER_NAME: 'testusername1' }});
        });

        describe('Signup Weak Passwords Tests', () => {
            it('should return 400 if username is not strong enough - no uppercase', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test2@mail.com', username: 'testusername1', password: 'test@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'User password is not strong enough');
            });
    
            it('should return 400 if username is not strong enough - no number', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test2@mail.com', username: 'testusername1', password: 'Testttttttt' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'User password is not strong enough');
            });
    
            it('should return 400 if username is not strong enough - no lowercase', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test2@mail.com', username: 'testusername1', password: 'TEST@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'User password is not strong enough');
            });
    
            it('should return 400 if username is not strong enough - not >= ', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test2@mail.com', username: 'testusername1', password: 'Test1' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'User password is not strong enough');
            });

        }) 

        it('should return 400 if email is already used for an account', async () => {
            await request(app)
                .post('/api/auth/signup')
                .send({ email: 'test@mail.com', username: 'testusername1', password: 'Test@123' }); // Use PASSWORD not password

            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'test@mail.com', username: 'testusername12', password: 'Test@123' }); // Use PASSWORD not password
        
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Email already in use');

            await User.destroy({ where: { USER_NAME: 'testusername1' }});
        });

        describe('Signup missing input fields', () => {
            it('should return 400 if email provided in request is empty', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: '', username: 'testusername1', password: 'test@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'No email provided in request');
            });
            it('should return 400 if email not provided in request', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ username: 'testusername1', password: 'test@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'No email provided in request');
            });

            it('should return 400 if password provided in request is empty', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test@example.com', username: 'testusername1', password: '' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'No password provided in request');
            });
            it('should return 400 if password not provided in request', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test@example.com', username: 'testusername1' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'No password provided in request');
            });

            it('should return 400 if username provided in request is empty', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test@example.com', username: '', password: 'test@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'No username provided in request');
            });
            it('should return 400 if username not provided in request', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test@example.com', password: 'test@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', 'No username provided in request');
            });
        });

        it('should return 400 if email is invalid', async () => {
            const response = await request(app)
            .post('/api/auth/signup')
            .send({ email: 'testmail.com', username: 'testusername1', password: 'Test@123' }); // Use PASSWORD not password
    
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Email is invalid');

        })

    });

    // Login Tests
    describe('Login Tests', () => {

    });
});