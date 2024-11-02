const request = require('supertest');
const app = require('../index'); // Adjust the path as needed
const db = require('../src/config/dbConfig');
const User = require('../src/models/User'); // Adjust the path as needed
const Password = require('../src/models/Password');

const { sequelize } = require('../src/config/dbConfig');

const { RESPONSE_MESSAGES } = require('../src/routes/ResponseMessageConstants.js');

let server;

const PORT = process.env.PORT || 3000;
describe('Authentication Tests', () => {

    beforeAll(async () => {
        try {
          await sequelize.sync({ force: true }); // Sync database
          console.log("Database & tables created!");
      
          server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
          });
        } catch (error) {
          console.error("Failed to sync database and start server:", error);
        }
      })

    afterAll(async () => {
        await sequelize.close();
        if(server) {
            server.close(() => {
                
            });
        }
    });

    // Signup Tests
    describe('Signup Tests', () => {
        
        it('should sign up a new user', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'test@mail.com', username: 'testusername1', password: 'Test@123' }); 
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.CREATED.message);
        
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
            expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_UNAVAILABLE_USERNAME.message);

            await User.destroy({ where: { USER_NAME: 'testusername1' }});
        });

        describe('Signup Weak Passwords Tests', () => {
            it('should return 400 if password is not strong enough - no uppercase', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test2@mail.com', username: 'testusername1', password: 'test@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_WEAK_PASSWORD.message);
            });
    
            it('should return 400 if password is not strong enough - no number', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test2@mail.com', username: 'testusername1', password: 'Testttttttt' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_WEAK_PASSWORD.message);
            });
    
            it('should return 400 if password is not strong enough - no lowercase', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test2@mail.com', username: 'testusername1', password: 'TEST@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_WEAK_PASSWORD.message);
            });
    
            it(`should return 400 if password is not strong enough - not >= 8`, async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test2@mail.com', username: 'testusername1', password: 'Test1' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_WEAK_PASSWORD.message);
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
            expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_UNAVAILABLE_EMAIL.message);

            await User.destroy({ where: { USER_NAME: 'testusername1' }});
        });

        describe('Signup missing input fields', () => {
            it('should return 400 if email provided in request is empty', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: '', username: 'testusername1', password: 'test@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_NO_EMAIL.message);
            });
            it('should return 400 if email not provided in request', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ username: 'testusername1', password: 'test@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_NO_EMAIL.message);
            });

            it('should return 400 if password provided in request is empty', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test@example.com', username: 'testusername1', password: '' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_NO_PASSWORD.message);
            });
            it('should return 400 if password not provided in request', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test@example.com', username: 'testusername1' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_NO_PASSWORD.message);
            });

            it('should return 400 if username provided in request is empty', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test@example.com', username: '', password: 'test@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_NO_USERNAME.message);
            });
            it('should return 400 if username not provided in request', async () => {
                const response = await request(app)
                    .post('/api/auth/signup')
                    .send({ email: 'test@example.com', password: 'test@123' }); // Use PASSWORD not password
            
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_NO_USERNAME.message);
            });
        });

        it('should return 400 if email is invalid', async () => {
            const response = await request(app)
            .post('/api/auth/signup')
            .send({ email: 'testmail.com', username: 'testusername1', password: 'Test@123' }); // Use PASSWORD not password
    
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_INVALID_EMAIL.message);

        })

    });

    // Login Tests
    describe('Login Tests', () => {
        beforeAll(async () => {
            await request(app)
                .post('/api/auth/signup')
                .send({ email: 'test@mail.com', username: 'testusername1', password: 'Test@123' }); 
            
        });

        afterAll(async () => {
            await User.destroy({ where: { USER_NAME: 'testusername1' }});
        });

        it('should authenticate user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@mail.com', password: 'Test@123' }); 
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.LOGIN.OK.message);
        });

        it('should authenticate user with different capitalization of email', async() => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email : 'TeSt@MAIl.com', password: 'Test@123'});
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.LOGIN.OK.message);
        })

        it('should return 404 if email is not tied to a registered user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'noaccount@mail.com', password: 'Test@123' }); 
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.LOGIN.NOT_FOUND_EMAIL.message);
        });

        it('should return 401 if unauthorized', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@mail.com', password: 'wrongpassword123' }); 
            
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.LOGIN.UNAUTHORIZED.message);
        });

        describe('Login status 400 errors', () => {
            it('should return 400 if email is invalid', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({ email: 'invalidemail.com', password: 'Test@123' }); 
                
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.LOGIN.BAD_REQUEST_INVALID_EMAIL.message);
            });

            it('should return 400 if email is provided in request is empty', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({ email: '', password: 'Test@123' }); 
                
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.LOGIN.BAD_REQUEST_NO_EMAIL.message);
            });
            it('should return 400 if no email provided in request', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({ password: 'Test@123' }); 
                
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.LOGIN.BAD_REQUEST_NO_EMAIL.message);
            });

            it('should return 400 if password is provided in request is empty', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({ email: 'test@mail.com', password: '' }); 
                
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.LOGIN.BAD_REQUEST_NO_PASSWORD.message);
            });
            it('should return 400 if no password provided in request', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({ email: 'test@mail.com' });  
                
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message', RESPONSE_MESSAGES.LOGIN.BAD_REQUEST_NO_PASSWORD.message);
            });
        });
    });
});