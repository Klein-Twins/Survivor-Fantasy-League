import { ApiError, ApiResponse } from '../../../src/generated-api';

export const validateSuccessApiResponse = (responseBody: ApiResponse) => {
  expect(responseBody).toHaveProperty('statusCode');
  expect(responseBody).not.toHaveProperty('error');
  expect(responseBody).toHaveProperty('success');
  expect(responseBody.success).toBe(true);
};

export const validateErrorApiResponse = (responseBody: ApiError) => {
  expect(responseBody).toHaveProperty('statusCode');
  expect(responseBody.statusCode).not.toBe(200);
  expect(responseBody).toHaveProperty('error');
  expect(responseBody).not.toHaveProperty('responseData');
  expect(responseBody).toHaveProperty('success');
  expect(responseBody.success).toBe(false);
};
