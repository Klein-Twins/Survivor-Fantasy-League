import request from 'supertest';
import app from '../index.ts'; // Adjust the path as needed
import { sequelize } from '../src/config/db.ts';
import { Server } from 'http';
import { APP_PORT } from '../src/config/config.ts';

let server: Server;

describe('Authentication Tests', () => {
    beforeAll(async () => {
        try {
            await sequelize.sync({ force: true }); // Sync database
            console.log("Database & tables created!");

            server = app.listen(APP_PORT, () => {
                console.log(`Server running on port ${APP_PORT}`);
            });
        } catch (error) {
            console.error("Failed to sync database and start server:", error);
        }
    });

    afterAll(async () => {
        await sequelize.close();
        if (server) {
            server.close(() => {
                console.log("Server closed.");
            });
        }
    });

});
