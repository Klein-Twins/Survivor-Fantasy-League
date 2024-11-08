import { UserAttributes } from "../../../src/models/User";
import userRepository from "../../../src/repositories/userRepository";
import authService from "../../../src/servicesAndHelpers/auth/authService";
import signupService from "../../../src/servicesAndHelpers/auth/signupService";
import userService from "../../../src/servicesAndHelpers/user/userService";
import { SignupFields } from "../../../src/types/auth/authTypes"
import authResponseFormatter from "../../../src/utils/apiFormatters/authResponseFormatter";

jest.mock("../../../src/repositories/userRepository");
jest.mock("../../../src/servicesAndHelpers/auth/authService");
jest.mock("../../../src/servicesAndHelpers/user/userService");
jest.mock("../../../src/utils/apiFormatters/authResponseFormatter");

describe("signupService tests", () => {

    const mockFields : SignupFields = {username: "Patrick687", password: "TestPassword123!", email: 'test@mail.com', firstName: "Pat", lastName:"K"};
    const mockUserRecord : UserAttributes = {USER_EMAIL: mockFields.email.toLowerCase(), USER_NAME: mockFields.username, USER_ID: "123", USER_PROFILE_ID: "12345"};
    const mockUserResponseObject = {username: mockUserRecord.USER_NAME, userProfileId: mockUserRecord.USER_PROFILE_ID};
    const mockToken = "2342522525251"

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it("should return a formatted success response with the user record and token when values are valid", async () => {
        (userRepository.findUserByEmail as jest.Mock).mockReturnValue(null);
        (userRepository.findUserByUsername as jest.Mock).mockReturnValue(null);
        (userService.createUser as jest.Mock).mockReturnValue(mockUserRecord);
        (authService.tokenService.generateToken as jest.Mock).mockReturnValue(mockToken);
        (authResponseFormatter.formatSignupResponse as jest.Mock).mockReturnValue({
            statusCode: 201,
            message: 'User created successfully',
            user: mockUserResponseObject,
            token: mockToken
        });

        const response = await signupService.signup(mockFields);

        expect(response).toEqual({
            statusCode: 201,
            message: 'User created successfully',
            user: mockUserResponseObject,
            token: mockToken
        })
    })
})