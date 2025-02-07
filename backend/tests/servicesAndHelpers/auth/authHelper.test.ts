import {
  validateSignupRequestData,
  validateLoginRequestData,
  isValidName,
  validateEmail,
} from '../../../src/servicesAndHelpersBackup/auth/authHelper';
import errorFactory from '../../../src/utils/errors/errorFactory';
import { SignupFields } from '../../../src/types/auth/authTypes';

jest.mock('../../../src/utils/errors/errorFactory');

describe('validateLoginRequestData', () => {
  it('should throw an error if email is missing', () => {
    const loginData = { email: '', password: 'password123' };

    expect(() => validateLoginRequestData(loginData)).toThrow();

    expect(errorFactory).toHaveBeenCalledWith({
      message: 'Missing email',
      statusCode: 400,
    });
  });

  it('should throw an error if email is invalid', () => {
    const loginData = { email: 'invalid-email', password: 'password123' };

    expect(() => validateLoginRequestData(loginData)).toThrow();

    expect(errorFactory).toHaveBeenCalledWith({
      message: 'Invalid Email',
      statusCode: 400,
    });
  });

  it('should throw an error if password is missing', () => {
    const loginData = { email: 'test@example.com', password: '' };

    expect(() => validateLoginRequestData(loginData)).toThrow(); // This should throw a 'Missing password' error

    expect(errorFactory).toHaveBeenCalledWith({
      message: 'Missing password',
      statusCode: 400,
    });
  });

  it('should validate email and password successfully', () => {
    const loginData = { email: 'test@example.com', password: 'password123' };
    expect(() => validateLoginRequestData(loginData)).not.toThrow();
  });

  it('should throw an error if password is empty', () => {
    const loginData = { email: 'test@example.com', password: '' };

    expect(() => validateLoginRequestData(loginData)).toThrow();

    expect(errorFactory).toHaveBeenCalledWith({
      message: 'Missing password',
      statusCode: 400,
    });
  });

  it('should throw an error if email is missing', () => {
    const loginData = { email: '', password: 'validPassword123' };

    expect(() => validateLoginRequestData(loginData)).toThrow();

    expect(errorFactory).toHaveBeenCalledWith({
      message: 'Missing email',
      statusCode: 400,
    });
  });

  it('should throw an error if email is not valid', () => {
    const loginData = { email: 'invalid-email', password: 'validPassword123' };

    expect(() => validateLoginRequestData(loginData)).toThrow();

    expect(errorFactory).toHaveBeenCalledWith({
      message: 'Invalid Email',
      statusCode: 400,
    });
  });
});

describe('validateSignupRequestData', () => {
  const validSignupData: SignupFields = {
    email: 'test@example.com',
    username: 'user123',
    password: 'StrongPassword123!',
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Email Tests
  test('throws error if email is empty', () => {
    expect(() => validateSignupRequestData({ ...validSignupData, email: '' })).toThrow();
    expect(errorFactory).toHaveBeenCalledWith({ message: 'Missing email', statusCode: 400 });
  });

  test('throws error if email is not in the request', () => {
    const { email, ...dataWithoutEmail } = validSignupData;
    expect(() => validateSignupRequestData(dataWithoutEmail as SignupFields)).toThrow();
    expect(errorFactory).toHaveBeenCalledWith({ message: 'Missing email', statusCode: 400 });
  });

  test('throws error if email is invalid', () => {
    expect(() => validateSignupRequestData({ ...validSignupData, email: 'invalid-email' })).toThrow();
    expect(errorFactory).toHaveBeenCalledWith({ message: 'Invalid email', statusCode: 400 });
  });

  test('does not throw error if email is valid', () => {
    expect(() => validateSignupRequestData(validSignupData)).not.toThrow();
  });

  // Password Tests
  test('throws error if password is empty', () => {
    expect(() => validateSignupRequestData({ ...validSignupData, password: '' })).toThrow();
    expect(errorFactory).toHaveBeenCalledWith({ message: 'Missing password', statusCode: 400 });
  });

  test('throws error if password is not in the request', () => {
    const { password, ...dataWithoutPassword } = validSignupData;
    expect(() => validateSignupRequestData(dataWithoutPassword as SignupFields)).toThrow();
    expect(errorFactory).toHaveBeenCalledWith({ message: 'Missing password', statusCode: 400 });
  });

  // Username Tests
  test('throws error if username is empty', () => {
    expect(() => validateSignupRequestData({ ...validSignupData, username: '' })).toThrow();
    expect(errorFactory).toHaveBeenCalledWith({ message: 'Missing username', statusCode: 400 });
  });

  test('throws error if username is not in the request', () => {
    const { username, ...dataWithoutUsername } = validSignupData;
    expect(() => validateSignupRequestData(dataWithoutUsername as SignupFields)).toThrow();
    expect(errorFactory).toHaveBeenCalledWith({ message: 'Missing username', statusCode: 400 });
  });

  // First Name Tests
  test('does not throw error if firstName is empty', () => {
    expect(() => validateSignupRequestData({ ...validSignupData, firstName: '' })).not.toThrow();
  });

  test('does not throw error if firstName is not in the request', () => {
    const { firstName, ...dataWithoutFirstName } = validSignupData;
    expect(() => validateSignupRequestData(dataWithoutFirstName as SignupFields)).not.toThrow();
  });

  test('throws error if firstName contains invalid characters', () => {
    expect(() => validateSignupRequestData({ ...validSignupData, firstName: 'John123' })).toThrow();
    expect(errorFactory).toHaveBeenCalledWith({
      message: 'Invalid first name: only letters and spaces allowed',
      statusCode: 400,
    });
  });

  test('does not throw error if firstName is valid', () => {
    expect(() => validateSignupRequestData({ ...validSignupData, firstName: 'John' })).not.toThrow();
  });

  // Last Name Tests
  test('does not throw error if lastName is empty', () => {
    expect(() => validateSignupRequestData({ ...validSignupData, lastName: '' })).not.toThrow();
  });

  test('does not throw error if lastName is not in the request', () => {
    const { lastName, ...dataWithoutLastName } = validSignupData;
    expect(() => validateSignupRequestData(dataWithoutLastName as SignupFields)).not.toThrow();
  });

  test('throws error if lastName contains invalid characters', () => {
    expect(() => validateSignupRequestData({ ...validSignupData, lastName: 'Doe123' })).toThrow();
    expect(errorFactory).toHaveBeenCalledWith({
      message: 'Invalid last name: only letters and spaces allowed',
      statusCode: 400,
    });
  });

  test('does not throw error if lastName is valid', () => {
    expect(() => validateSignupRequestData({ ...validSignupData, lastName: 'Doe' })).not.toThrow();
  });
});

describe('isValidName(email:string) : boolean', () => {
  test('should return true for valid name with only letters and spaces', () => {
    expect(isValidName('John Doe')).toBe(true);
    expect(isValidName('Jane')).toBe(true);
    expect(isValidName('Alice Johnson')).toBe(true);
  });

  test('should return false for names with numbers', () => {
    expect(isValidName('John123')).toBe(false);
    expect(isValidName('1234')).toBe(false);
    expect(isValidName('Alice1')).toBe(false);
  });

  test('should return false for names with special characters', () => {
    expect(isValidName('John@Doe')).toBe(false);
    expect(isValidName('Jane!')).toBe(false);
    expect(isValidName('Alice#Johnson')).toBe(false);
  });

  test('should return false for names with multiple spaces or leading/trailing spaces', () => {
    expect(isValidName('  John Doe')).toBe(false); // Leading space
    expect(isValidName('John Doe  ')).toBe(false); // Trailing space
    expect(isValidName('John   Doe')).toBe(false); // Multiple spaces
  });

  test('should return false for empty strings', () => {
    expect(isValidName('')).toBe(false);
  });

  test('should return true for names with spaces between valid parts', () => {
    expect(isValidName('John   Doe')).toBe(false); // Multiple spaces between words
  });

  test('should return false for names with punctuation marks', () => {
    expect(isValidName('John-Doe')).toBe(false);
    expect(isValidName('Jane: Doe')).toBe(false);
    expect(isValidName('Alice, Johnson')).toBe(false);
  });

  test('should return true for single letter names', () => {
    expect(isValidName('A')).toBe(true);
    expect(isValidName('Z')).toBe(true);
  });

  test('should return false for names containing accented characters', () => {
    expect(isValidName('José')).toBe(true); // Contains an accent
    expect(isValidName('Mário')).toBe(true); // Contains an accent
  });

  test('should return true for names with multiple words and spaces between them', () => {
    expect(isValidName('John Adam Doe')).toBe(true);
    expect(isValidName('Anna Marie Smith')).toBe(true);
  });
});

describe('validateEmail', () => {
  test('should return true for valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true); // Basic valid email
    expect(validateEmail('user.name@domain.co')).toBe(true); // Email with dot in username and domain
    expect(validateEmail('user+name@domain.com')).toBe(true); // Email with plus sign
    expect(validateEmail('name@subdomain.domain.com')).toBe(true); // Email with subdomain
    expect(validateEmail('first.last@subdomain.example.com')).toBe(true); // Email with subdomain and multiple dots
    expect(validateEmail('test123@example123.com')).toBe(true); // Email with numbers in domain
    expect(validateEmail('user@domain.museum')).toBe(true); // Email with a less common domain type
  });

  test('should return false for invalid emails with missing "@" symbol', () => {
    expect(validateEmail('testexample.com')).toBe(false); // Missing '@'
    expect(validateEmail('test@com')).toBe(false); // Missing domain part
  });

  test('should return false for emails with extra spaces', () => {
    expect(validateEmail(' test@example.com')).toBe(false); // Leading space
    expect(validateEmail('test@example.com ')).toBe(false); // Trailing space
    expect(validateEmail(' test@domain.com ')).toBe(false); // Leading and trailing spaces
    expect(validateEmail('test@ domain .com')).toBe(false); // Spaces in domain part
  });

  test('should return false for emails with invalid characters', () => {
    expect(validateEmail('test@ex!ample.com')).toBe(false); // Invalid character '!'
    expect(validateEmail('test@ex@ample.com')).toBe(false); // Extra '@'
    expect(validateEmail('test@ex_ample.com')).toBe(false); // Underscore in domain name (invalid)
    expect(validateEmail('test@exam-ple.com')).toBe(true); // Hyphen at the end of the domain
  });

  test('should return false for emails with invalid domain extension', () => {
    expect(validateEmail('test@example..com')).toBe(false); // Double dot in domain extension
    expect(validateEmail('test@domain.c@om')).toBe(false); // '@' in domain extension
    expect(validateEmail('test@domain.c')).toBe(false); // Incomplete domain extension
    expect(validateEmail('test@domain.ex#com')).toBe(false); // Special character in domain extension
  });

  test('should return false for emails with empty username or domain', () => {
    expect(validateEmail('@domain.com')).toBe(false); // Missing username
    expect(validateEmail('test@')).toBe(false); // Missing domain
    expect(validateEmail('test@.com')).toBe(false); // Missing domain name before '.'
    expect(validateEmail('@.com')).toBe(false); // Missing username and domain name
  });

  test('should return false for emails with multiple consecutive dots', () => {
    expect(validateEmail('test..example@domain.com')).toBe(false); // Multiple dots in username
    expect(validateEmail('test@example..com')).toBe(false); // Multiple dots in domain part
    expect(validateEmail('test@subdomain..domain.com')).toBe(false); // Multiple dots in subdomain
  });

  test('should return false for emails with invalid characters before or after the "@" symbol', () => {
    expect(validateEmail('test@exam#ple.com')).toBe(false); // Invalid character '#' before '@'
    expect(validateEmail('test@.example.com')).toBe(false); // Invalid dot before domain
    expect(validateEmail('te@st@example.com')).toBe(false); // Invalid '@' before the domain
  });

  test('should return false for empty email strings', () => {
    expect(validateEmail('')).toBe(false); // Empty string
  });
});
