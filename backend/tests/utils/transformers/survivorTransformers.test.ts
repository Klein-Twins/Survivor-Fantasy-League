import { transformSurvivorWithDetailsData } from "../../../src/utils/transformers/survivorTransformers";
import { SeasonSurvivorWithDetailsAttributes, SurvivorWithDetailsObject } from "../../../src/types/survivor/survivorTypes";

describe('transformSurvivorWithDetailsData', () => {

    // 1. Basic Transformation Test
    it('should correctly map fields from SeasonSurvivorWithDetailsAttributes to SurvivorWithDetailsObject', () => {
        const input: SeasonSurvivorWithDetailsAttributes = {
            SURVIVOR_ID: '123',
            SEASON_ID: 1,
            ORIGINAL_TRIBE_ID: 'tribe01',
            AGE: 28,
            DESCRIPTION: 'A brave survivor',
            JOB: 'Engineer',
            IMAGE_URL: 'http://example.com/image1.jpg',
            Survivor: {
                FIRST_NAME: 'John',
                LAST_NAME: 'Doe',
                NICK_NAME: 'The Brave',
                FROM_CITY: 'New York',
                FROM_STATE: 'NY',
                FROM_COUNTRY: 'USA'
            }
        } as SeasonSurvivorWithDetailsAttributes;

        const result: SurvivorWithDetailsObject = transformSurvivorWithDetailsData(input);

        expect(result.survivorId).toBe('123');
        expect(result.seasonId).toBe(1);
        expect(result.originalTribeId).toBe('tribe01');
        expect(result.age).toBe(28);
        expect(result.description).toBe('A brave survivor');
        expect(result.job).toBe('Engineer');
        expect(result.imageUrl).toBe('http://example.com/image1.jpg');
        expect(result.firstName).toBe('John');
        expect(result.lastName).toBe('Doe');
        expect(result.nickName).toBe('The Brave');
        expect(result.fromCity).toBe('New York');
        expect(result.fromState).toBe('NY');
        expect(result.fromCountry).toBe('USA');
    });

    // 2. Missing Optional Fields in Survivor
    it('should return null for missing optional fields in Survivor', () => {
        const input: SeasonSurvivorWithDetailsAttributes = {
            SURVIVOR_ID: '124',
            SEASON_ID: 2,
            ORIGINAL_TRIBE_ID: 'tribe02',
            AGE: 35,
            DESCRIPTION: 'A tactical player',
            JOB: 'Scientist',
            IMAGE_URL: 'http://example.com/image2.jpg',
            Survivor: {} // Empty Survivor object, optional fields are missing
        } as SeasonSurvivorWithDetailsAttributes;

        const result: SurvivorWithDetailsObject = transformSurvivorWithDetailsData(input);

        expect(result.survivorId).toBe('124');
        expect(result.firstName).toBeUndefined();
        expect(result.lastName).toBeUndefined();
        expect(result.nickName).toBeNull();
        expect(result.fromCity).toBeNull();
        expect(result.fromState).toBeUndefined();
        expect(result.fromCountry).toBeUndefined();
    });

    // 3. Empty Survivor Object
    it('should handle an empty Survivor object gracefully', () => {
        const input: SeasonSurvivorWithDetailsAttributes = {
            SURVIVOR_ID: '125',
            SEASON_ID: 3,
            ORIGINAL_TRIBE_ID: 'tribe03',
            AGE: 40,
            DESCRIPTION: 'A strong competitor',
            JOB: 'Teacher',
            IMAGE_URL: 'http://example.com/image3.jpg',
            Survivor: {} // Empty Survivor object
        } as SeasonSurvivorWithDetailsAttributes;

        const result: SurvivorWithDetailsObject = transformSurvivorWithDetailsData(input);

        expect(result.survivorId).toBe('125');
        expect(result.firstName).toBeUndefined();
        expect(result.lastName).toBeUndefined();
        expect(result.nickName).toBeNull();
        expect(result.fromCity).toBeNull();
        expect(result.fromState).toBeUndefined();
        expect(result.fromCountry).toBeUndefined();
    });

    // 4. Null or Undefined Survivor Object
    it('should return null for undefined or null Survivor object', () => {
        const inputWithNull: SeasonSurvivorWithDetailsAttributes = {
            SURVIVOR_ID: '126',
            SEASON_ID: 4,
            ORIGINAL_TRIBE_ID: 'tribe04',
            AGE: 24,
            DESCRIPTION: 'A cunning player',
            JOB: 'Lawyer',
            IMAGE_URL: 'http://example.com/image4.jpg',
            Survivor: null // Null Survivor object
        } as SeasonSurvivorWithDetailsAttributes;

        const inputWithUndefined: SeasonSurvivorWithDetailsAttributes = {
            SURVIVOR_ID: '127',
            SEASON_ID: 5,
            ORIGINAL_TRIBE_ID: 'tribe05',
            AGE: 33,
            DESCRIPTION: 'A clever strategist',
            JOB: 'Doctor',
            IMAGE_URL: 'http://example.com/image5.jpg',
            Survivor: undefined // Undefined Survivor object
        } as SeasonSurvivorWithDetailsAttributes;

        const resultNull: SurvivorWithDetailsObject = transformSurvivorWithDetailsData(inputWithNull);
        const resultUndefined: SurvivorWithDetailsObject = transformSurvivorWithDetailsData(inputWithUndefined);

        expect(resultNull.survivorId).toBe('126');
        expect(resultNull.firstName).toBeUndefined();
        expect(resultNull.lastName).toBeUndefined();
        expect(resultNull.nickName).toBeNull();

        expect(resultUndefined.survivorId).toBe('127');
        expect(resultUndefined.firstName).toBeUndefined();
        expect(resultUndefined.lastName).toBeUndefined();
        expect(resultUndefined.nickName).toBeNull();
    });

    // 5. Handling Non-Standard Survivor Fields
    it('should handle non-standard values in Survivor fields', () => {
        const input: SeasonSurvivorWithDetailsAttributes = {
            SURVIVOR_ID: '128',
            SEASON_ID: 6,
            ORIGINAL_TRIBE_ID: 'tribe06',
            AGE: 29,
            DESCRIPTION: 'A strategic thinker',
            JOB: 'Architect',
            IMAGE_URL: 'http://example.com/image6.jpg',
            Survivor: {
                FIRST_NAME: 'Jane',
                LAST_NAME: '',
                NICK_NAME: 'The Strategist',
                FROM_CITY: 'Los Angeles',
                FROM_STATE: 'CA',
                FROM_COUNTRY: 'USA'
            }
        } as SeasonSurvivorWithDetailsAttributes;

        const result: SurvivorWithDetailsObject = transformSurvivorWithDetailsData(input);

        expect(result.survivorId).toBe('128');
        expect(result.firstName).toBe('Jane');
        expect(result.lastName).toBe('');
        expect(result.nickName).toBe('The Strategist');
        expect(result.fromCity).toBe('Los Angeles');
        expect(result.fromState).toBe('CA');
        expect(result.fromCountry).toBe('USA');
    });

    // 6. Edge Case with Empty `SeasonSurvivorWithDetailsAttributes`
    it('should handle missing optional fields in SeasonSurvivorWithDetailsAttributes gracefully', () => {
        const input: SeasonSurvivorWithDetailsAttributes = {
            SURVIVOR_ID: '129',
            SEASON_ID: 7,
            ORIGINAL_TRIBE_ID: '',
            AGE: 38,
            DESCRIPTION: '',
            JOB: 'Photographer',
            IMAGE_URL: 'http://example.com/image7.jpg',
            Survivor: undefined // No Survivor object
        } as SeasonSurvivorWithDetailsAttributes;

        const result: SurvivorWithDetailsObject = transformSurvivorWithDetailsData(input);

        expect(result.survivorId).toBe('129');
        expect(result.originalTribeId).toBeNull();
        expect(result.age).toBe(38);
        expect(result.description).toBe('');
        expect(result.job).toBe('Photographer');
        expect(result.imageUrl).toBe('http://example.com/image7.jpg');
        expect(result.firstName).toBeUndefined();
        expect(result.lastName).toBeUndefined();
        expect(result.nickName).toBeNull();
    });


    // 7. Ensure Defaults for Missing Fields
    it('should return null for missing optional fields in Survivor', () => {
        const input: SeasonSurvivorWithDetailsAttributes = {
            SURVIVOR_ID: '130',
            SEASON_ID: 15,
            ORIGINAL_TRIBE_ID: 'tribe08',
            AGE: 32,
            DESCRIPTION: 'A skilled survivor',
            JOB: 'Chef',
            IMAGE_URL: 'http://example.com/image8.jpg',
            Survivor: {}, // Empty Survivor object, optional fields are missing
        } as SeasonSurvivorWithDetailsAttributes;

        const result: SurvivorWithDetailsObject = transformSurvivorWithDetailsData(input);

        expect(result.survivorId).toBe('130');
        expect(result.firstName).toBeUndefined();
        expect(result.lastName).toBeUndefined();
        expect(result.nickName).toBeNull();
        expect(result.fromCity).toBeNull();
        expect(result.fromState).toBeUndefined();
        expect(result.fromCountry).toBeUndefined();
    });

    // 8. Ensure Defaults for Missing Fields
    it('should return null for missing optional fields in Survivor', () => {
        const input: SeasonSurvivorWithDetailsAttributes = {
            SURVIVOR_ID: '130',
            SEASON_ID: 15,
            ORIGINAL_TRIBE_ID: 'tribe08',
            AGE: 32,
            DESCRIPTION: 'A skilled survivor',
            JOB: 'Chef',
            IMAGE_URL: 'http://example.com/image8.jpg',
            Survivor: {}, // Empty Survivor object, optional fields are missing
        } as SeasonSurvivorWithDetailsAttributes;

        const result = transformSurvivorWithDetailsData(input);

        expect(result.survivorId).toBe('130');
        expect(result.firstName).toBeUndefined();
        expect(result.lastName).toBeUndefined();
        expect(result.nickName).toBeNull();
        expect(result.fromCity).toBeNull();
        expect(result.fromState).toBeUndefined();
        expect(result.fromCountry).toBeUndefined();
    });


});