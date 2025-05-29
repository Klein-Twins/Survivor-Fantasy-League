import 'reflect-metadata';
import { sequelize } from '../src/config/db';
import seedData from '../src/data/seedData';

jest.mock('../src/config/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  verbose: jest.fn(),
  debug: jest.fn(),
  silly: jest.fn(),
  apiOp: jest.fn(),
  db: jest.fn(),
}));

beforeAll(async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});

  // Sync the database before tests (only in test environment)
  if (process.env.NODE_ENV === 'test') {
    console.log('Syncing database...');
    await sequelize.sync({ force: true }); // Reset DB
    console.log('Database synced successfully');
    console.log('Seeding data...');
    await seedData();
    console.log('Data seeded successfully...');
  }
});

afterAll(async () => {
  // Clean up DB connection after tests are done
  if (process.env.NODE_ENV === 'test') {
    await sequelize.close(); // Close the database connection
  }
});
