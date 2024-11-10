import { sequelize } from "../src/config/db";

beforeAll(async () => {
  // Sync the database before tests (only in test environment)
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync({ force: true }); // Reset DB
  }
});

afterAll(async () => {
  // Clean up DB connection after tests are done
  if (process.env.NODE_ENV === 'test') {
    await sequelize.close(); // Close the database connection
  }
});