import loginService from "../../../src/servicesAndHelpers/auth/loginService";
import userRepository from "../../../src/repositories/userRepository";
import userService from "../../../src/servicesAndHelpers/user/userService";
import errorFactory from "../../../src/utils/errors/errorFactory";
import authResponseFormatter from "../../../src/utils/apiResponseFormatters/authResponseFormatter";
import authService from "../../../src/servicesAndHelpers/auth/authService";
import CustomError, { NotFoundError, UnauthorizedError, ValidationError } from "../../../src/utils/errors/errors";
import { UserAttributes } from "../../../src/models/User";
import tokenService from "../../../src/servicesAndHelpers/auth/tokenService";

jest.mock("../../../src/repositories/userRepository");
jest.mock("../../../src/servicesAndHelpers/user/userService");
jest.mock("../../../src/utils/errors/errorFactory");
jest.mock("../../../src/utils/apiResponseFormatters/authResponseFormatter");
jest.mock("../../../src/servicesAndHelpers/auth/authService");
jest.mock("../../../src/servicesAndHelpers/auth/tokenService");

describe("loginService.login", () => {

    const mockFields = { email: "test@example.com", password: "securePassword123" };
    const mockUserRecord : UserAttributes = { USER_ID: "23423", USER_EMAIL: mockFields.email, USER_PROFILE_ID: "32525-2342242-234242", USER_NAME: "HELLO_TEST_WORLD" };
    const mockUserResponse = {username : mockUserRecord.USER_NAME, userProfileId: mockUserRecord.USER_PROFILE_ID};
    const mockToken : string = "4klj4lj34lk3jtlk34j3ljt3k4ltj3l34t3dfwf";

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it("should throw an error if email or password is missing", async () => {
        const invalidFields = { email: "", password: "" };

        // Mock errorFactory for this test case to throw ValidationError
        (errorFactory as jest.Mock).mockImplementation(() => {
            throw new ValidationError("Email and password are required");
        })

        await expect(loginService.login(invalidFields))
            .rejects.toThrow("Email and password are required");

        expect(errorFactory).toHaveBeenCalledWith({
            message: "Email and password are required",
            statusCode: 400,
        });
    });

    it("should throw an error if no account is found for the provided email", async () => {
        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

        (errorFactory as jest.Mock).mockImplementation(() => {
            throw new ValidationError("No account tied to the provided email");
        });

        await expect(loginService.login(mockFields))
            .rejects.toThrow("No account tied to the provided email");

        expect(errorFactory).toHaveBeenCalledWith({
            message: "No account tied to the provided email",
            statusCode: 404,
        });
    });

    /*
    Incorrect Password: Verify that if the email exists but the password is incorrect, 
    it throws a 401 error with an appropriate message.
    */
    it("should throw a 401 Unauthorized error if the email exists but the password is incorrect", async () => {
        const input = { email: "test@example.com", password: "securePassword123" };

        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUserRecord);

        (userService.authenticateUser as jest.Mock).mockResolvedValue(false);

        (errorFactory as jest.Mock).mockImplementation(() => {
            throw new UnauthorizedError("Incorrect password. Please try again");
        })

        await expect(loginService.login(input)).rejects.toThrow("Incorrect password. Please try again");

        expect(errorFactory).toHaveBeenCalledWith({
            message: "Incorrect password. Please try again",
            statusCode: 401
        });
    })

    /*
    Successful Login: Confirm that with valid credentials, the login function successfully 
    returns the formatted login response, which should include a JWT token and user data.
    */
    it("should return a formatted login response with a JWT token and user data if valid credentials", async () => {
        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUserRecord);
        (userService.authenticateUser as jest.Mock).mockResolvedValue(true);
        (authService.tokenService.generateToken as jest.Mock).mockReturnValue(mockToken);
        (authResponseFormatter.formatLoginResponse as jest.Mock).mockReturnValue({
            statusCode: 200,
            message: 'User authenticated successfully',
            user: mockUserResponse,
            token: mockToken
        });

        const response = await loginService.login(mockFields);

        expect(userRepository.findUserByEmail).toHaveBeenCalledWith(mockFields.email.toLowerCase())
        expect(userService.authenticateUser).toHaveBeenCalledWith(
            mockUserRecord, mockFields.password
        )
        expect(authService.tokenService.generateToken).toHaveBeenCalledWith({
            user: mockUserRecord.USER_ID
        })
        expect(authResponseFormatter.formatLoginResponse).toHaveBeenCalledWith(
            200,
            'User authenticated successfully',
            mockUserRecord,
            mockToken
        );

        expect(response).toEqual({
            statusCode: 200,
            message: 'User authenticated successfully',
            user: mockUserResponse,
            token: mockToken
        })
    }) 

    /*
    JWT Token Generation: Verify that the authService.tokenService.generateToken is called 
    with the correct user ID when login succeeds.
    */
    it("Should call authService.tokenService.generate token with correct userId when login succeeds", async () => {
        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUserRecord);
        (userService.authenticateUser as jest.Mock).mockResolvedValue(true);
        (authService.tokenService.generateToken as jest.Mock).mockReturnValue(mockToken);

        await loginService.login(mockFields);

        expect(userRepository.findUserByEmail).toHaveBeenCalledWith(mockFields.email.toLowerCase())

        expect(userService.authenticateUser).toHaveBeenCalledWith(mockUserRecord, mockFields.password);

        expect(authService.tokenService.generateToken).toHaveBeenCalledWith({
            user: mockUserRecord.USER_ID
        });
    })

    /*
    Database Error Handling: Check if the login function handles unexpected database errors, 
    like when userRepository.findUserByEmail or userService.authenticateUser fails unexpectedly. 
    This test is useful for ensuring that the function behaves predictably with database connection 
    issues or other underlying issues.
    */

    it("should handle errors when userRepository.findUserByEmail throws an unexpected error", async () => {
        (userRepository.findUserByEmail as jest.Mock).mockImplementation(() => {
            throw new CustomError(500, "Database connect error");
        })

        await expect(loginService.login(mockFields)).rejects.toThrow("Database connect error");

        expect(userService.authenticateUser).not.toHaveBeenCalled();
        expect(authService.tokenService.generateToken).not.toHaveBeenCalled();
        expect(authResponseFormatter.formatLoginResponse).not.toHaveBeenCalled();
    })

    it("should handle errors when userService.authenticateUser throws an unexpected error", async () => {
        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUserRecord);
        (userService.authenticateUser as jest.Mock).mockImplementation(() => {
            throw new CustomError(500, "Unexpected authentication error");
        });
    
        await expect(loginService.login(mockFields)).rejects.toThrow("Unexpected authentication error");
    
        expect(authService.tokenService.generateToken).not.toHaveBeenCalled();
        expect(authResponseFormatter.formatLoginResponse).not.toHaveBeenCalled();
    });

    it("email with different casing should be authenicated as email is not case sensitive", async () => {
        const email = "teST@eXaMPle.cOm";
        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(() => mockUserRecord);
        (userService.authenticateUser as jest.Mock).mockResolvedValue(true);

        await loginService.login({email, password: mockFields.password});

        expect(userRepository.findUserByEmail).toHaveBeenCalledWith(mockFields.email.toLowerCase());
        expect(email).not.toEqual(mockUserRecord.USER_EMAIL);
        expect(email.toLowerCase()).toEqual(mockUserRecord.USER_EMAIL);
    });

    it("should handle errors when tokenService.generateToken throws an error", async () => {
        // Mock all the previous steps to be successful
        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUserRecord);
        (userService.authenticateUser as jest.Mock).mockResolvedValue(true);
    
        // Mock tokenService.generateToken to throw an error
        (authService.tokenService.generateToken as jest.Mock).mockImplementation(() => {
            throw new Error("Token generation failed");
        });
    
        // Verify that loginService correctly handles the token generation error
        await expect(loginService.login(mockFields))
            .rejects.toThrow("Token generation failed");
    
        // Ensure the token generation and other necessary methods were called
        expect(userRepository.findUserByEmail).toHaveBeenCalledWith(mockFields.email.toLowerCase());
        expect(userService.authenticateUser).toHaveBeenCalledWith(mockUserRecord, mockFields.password);
        expect(authService.tokenService.generateToken).toHaveBeenCalledWith({
            user: mockUserRecord.USER_ID
        });
        expect(authResponseFormatter.formatLoginResponse).not.toHaveBeenCalled();
    });
});