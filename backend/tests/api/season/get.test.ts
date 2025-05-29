import request from 'supertest';
import app from '../../../app';
import { Season } from '../../../src/generated-api';
import { validateSuccessApiResponse } from '../auth/testHelper';
import { SeasonValidator } from './objectValidation/SeasonValidator';
import { runValidation } from '../../utils/objectValidator';

describe('GET /api/season/', () => {
  it('should return a list of season with a 200 status code', async () => {
    const response = await request(app).get('/api/season');
    validateSuccessApiResponse(response.body);
    expect(response.status).toBe(200);
    expect(response.body.responseData).toHaveProperty('seasons');
    expect(Array.isArray(response.body.responseData.seasons)).toBe(true);
  });

  it('should return a list of valid seasons', async () => {
    const response = await request(app).get('/api/season');
    validateSuccessApiResponse(response.body);
    const responseSeasons = response.body.responseData.seasons as Season[];
    expect(Array.isArray(responseSeasons)).toBe(true);

    const seasonValidator = new SeasonValidator();
    await runValidation(seasonValidator, responseSeasons);
  });
});

// it('call to /api/season should return a list of seasons with a 200 status code', async () => {
//   const response = await request(app).get('/api/season');
//   validateSuccessApiResponse(response.body);
//   expect(response.status).toBe(200);
//   expect(response.body.responseData).toHaveProperty('seasons');
//   expect(Array.isArray(response.body.responseData.seasons)).toBe(true);
//   expect(response.body.responseData.seasons.length).toBeGreaterThan(0);
// });

// it('should return a list of valid seasons', async () => {
//   const response = await request(app).get('/api/season');
//   validateSuccessApiResponse(response.body);
//   const responseSeasons = response.body.responseData.seasons as Season[];
//   expect(Array.isArray(responseSeasons)).toBe(true);
//   expect(responseSeasons.length).toBeGreaterThan(0);
//   await validateSeasonObjects(responseSeasons);
// });
