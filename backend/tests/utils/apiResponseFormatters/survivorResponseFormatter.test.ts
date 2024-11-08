import getSurvivorResponseDataFormatter from '../../../src/utils/apiResponseFormatters/survivorResponseFormatter';
import { SurvivorsWithDetailsBySeasonResponseData, SurvivorWithDetailsObject } from '../../../src/types/survivor/survivorTypes';

describe('getSurvivorResponseDataFormatter', () => {
    // Test Case 1: Valid survivors data with typical message and status code
    it('should format response with valid survivors data', () => {
        const statusCode = 200;
        const message = 'Successfully retrieved survivors';
        const survivors: SurvivorWithDetailsObject[] = [
            {
                survivorId: '1',
                seasonId: 1,
                firstName: 'John',
                lastName: 'Doe',
                nickName: 'Johnny',
                originalTribeId: 'TribeA',
                age: 30,
                description: 'A brave contestant',
                job: 'Engineer',
                fromCity: 'New York',
                fromState: 'NY',
                fromCountry: 'USA',
                imageUrl: 'https://example.com/image.jpg'
            }
        ];

        const result: SurvivorsWithDetailsBySeasonResponseData = getSurvivorResponseDataFormatter.formatgetSurvivorsWithDetailsBySeasonResponse(
            statusCode,
            message,
            survivors
        );

        expect(result.statusCode).toBe(statusCode);
        expect(result.message).toBe(message);
        expect(result.survivors).toEqual(survivors);
    });

    // Test Case 2: Empty survivors array
    it('should format response correctly when survivors array is empty', () => {
        const statusCode = 200;
        const message = 'No survivors found';
        const survivors: SurvivorWithDetailsObject[] = [];

        const result: SurvivorsWithDetailsBySeasonResponseData = getSurvivorResponseDataFormatter.formatgetSurvivorsWithDetailsBySeasonResponse(
            statusCode,
            message,
            survivors
        );

        expect(result.statusCode).toBe(statusCode);
        expect(result.message).toBe(message);
        expect(result.survivors).toEqual([]);
    });

    // Test Case 3: Single survivor with minimal data
    it('should format response correctly with one survivor with minimal data', () => {
        const statusCode = 200;
        const message = 'Single survivor retrieved';
        const survivors: SurvivorWithDetailsObject[] = [
            {
                survivorId: '2',
                seasonId: 1,
                firstName: 'Jane',
                lastName: 'Doe',
                nickName: 'Janey',
                originalTribeId: 'TribeB',
                age: 25,
                description: 'A fierce competitor',
                job: 'Teacher',
                fromCity: 'Los Angeles',
                fromState: 'CA',
                fromCountry: 'USA',
                imageUrl: 'https://example.com/image2.jpg'
            }
        ];

        const result: SurvivorsWithDetailsBySeasonResponseData = getSurvivorResponseDataFormatter.formatgetSurvivorsWithDetailsBySeasonResponse(
            statusCode,
            message,
            survivors
        );

        expect(result.statusCode).toBe(statusCode);
        expect(result.message).toBe(message);
        expect(result.survivors).toEqual(survivors);
    });

    // Test Case 4: Custom status code and complex survivors data
    it('should format response correctly with a custom status code and multiple survivors', () => {
        const statusCode = 201; // Created
        const message = 'Survivors data created';
        const survivors: SurvivorWithDetailsObject[] = [
            {
                survivorId: '3',
                seasonId: 2,
                firstName: 'Alice',
                lastName: 'Smith',
                nickName: 'Ally',
                originalTribeId: 'TribeC',
                age: 29,
                description: 'A strong player',
                job: 'Architect',
                fromCity: 'Chicago',
                fromState: 'IL',
                fromCountry: 'USA',
                imageUrl: 'https://example.com/image3.jpg'
            },
            {
                survivorId: '4',
                seasonId: 2,
                firstName: 'Bob',
                lastName: 'Johnson',
                nickName: 'Bobby',
                originalTribeId: 'TribeD',
                age: 31,
                description: 'A strategic competitor',
                job: 'Artist',
                fromCity: 'Miami',
                fromState: 'FL',
                fromCountry: 'USA',
                imageUrl: 'https://example.com/image4.jpg'
            }
        ];

        const result: SurvivorsWithDetailsBySeasonResponseData = getSurvivorResponseDataFormatter.formatgetSurvivorsWithDetailsBySeasonResponse(
            statusCode,
            message,
            survivors
        );

        expect(result.statusCode).toBe(statusCode);
        expect(result.message).toBe(message);
        expect(result.survivors).toEqual(survivors);
    });

    // Test Case 5: Non-200 success status code and empty message
    it('should format response with empty message and a custom success status code', () => {
        const statusCode = 202; // Accepted
        const message = '';
        const survivors: SurvivorWithDetailsObject[] = [
            {
                survivorId: '5',
                seasonId: 3,
                firstName: 'Charlie',
                lastName: 'Brown',
                nickName: 'Chuck',
                originalTribeId: 'TribeE',
                age: 35,
                description: 'An experienced survivor',
                job: 'Doctor',
                fromCity: 'Seattle',
                fromState: 'WA',
                fromCountry: 'USA',
                imageUrl: 'https://example.com/image5.jpg'
            }
        ];

        const result: SurvivorsWithDetailsBySeasonResponseData = getSurvivorResponseDataFormatter.formatgetSurvivorsWithDetailsBySeasonResponse(
            statusCode,
            message,
            survivors
        );

        expect(result.statusCode).toBe(statusCode);
        expect(result.message).toBe(message);
        expect(result.survivors).toEqual(survivors);
    });

    // Test Case 6: Valid response with special characters in message
    it('should format response correctly when the message contains special characters', () => {
        const statusCode = 200;
        const message = 'Successfully retrieved survivors with details: !@#$%^&*()';
        const survivors: SurvivorWithDetailsObject[] = [
            {
                survivorId: '6',
                seasonId: 4,
                firstName: 'Dave',
                lastName: 'Jones',
                nickName: 'DJ',
                originalTribeId: 'TribeF',
                age: 40,
                description: 'A tactical player',
                job: 'Lawyer',
                fromCity: 'San Francisco',
                fromState: 'CA',
                fromCountry: 'USA',
                imageUrl: 'https://example.com/image6.jpg'
            }
        ];

        const result: SurvivorsWithDetailsBySeasonResponseData = getSurvivorResponseDataFormatter.formatgetSurvivorsWithDetailsBySeasonResponse(
            statusCode,
            message,
            survivors
        );

        expect(result.statusCode).toBe(statusCode);
        expect(result.message).toBe(message);
        expect(result.survivors).toEqual(survivors);
    });

    // Test Case 7: Long message string
    it('should format response correctly with a long message', () => {
        const statusCode = 200;
        const message = 'Successfully retrieved survivors data for the requested season. This message is quite long to test the formatter functionality under different circumstances.';
        const survivors: SurvivorWithDetailsObject[] = [
            {
                survivorId: '7',
                seasonId: 5,
                firstName: 'Emma',
                lastName: 'Wilson',
                nickName: 'Em',
                originalTribeId: 'TribeG',
                age: 27,
                description: 'A resilient player',
                job: 'Nurse',
                fromCity: 'Houston',
                fromState: 'TX',
                fromCountry: 'USA',
                imageUrl: 'https://example.com/image7.jpg'
            }
        ];

        const result: SurvivorsWithDetailsBySeasonResponseData = getSurvivorResponseDataFormatter.formatgetSurvivorsWithDetailsBySeasonResponse(
            statusCode,
            message,
            survivors
        );

        expect(result.statusCode).toBe(statusCode);
        expect(result.message).toBe(message);
        expect(result.survivors).toEqual(survivors);
    });
});