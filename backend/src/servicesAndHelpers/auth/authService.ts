import loginService from './loginService';
import signupService from './signupService';
import logoutService from './logoutService';
import tokenService from './tokenService';

/**
 * The `authService` is a centralized service that consolidates all authentication-related functionalities.
 * It exposes methods for user login, signup, logout, and JWT token management.
 *
 * ### Available Services:
 * - `loginService`: Handles user login, validates credentials, and generates JWT tokens.
 * - `signupService`: Handles user registration, ensures unique email and username, and creates a new user.
 * - `logoutService`: Manages the user logout process, which might involve token invalidation or cleanup.
 * - `tokenService`: Provides functionality for generating, validating, and managing JWT tokens.
 *
 * ### Example Usage:
 * ```typescript
 * // For user login
 * const loginResponse = await authService.loginService.login(loginFields);
 *
 * // For user signup
 * const signupResponse = await authService.signupService.signup(signupFields);
 * 
 * // For user logout
 * const logoutResponse = await authService.logoutService.logout();
 *
 * // For token management
 * const token = authService.tokenService.generateToken(payload);
 * ```
 */
const authService = {
  /**
   * `loginService` handles user authentication by validating the login credentials and generating a JWT token.
   * 
   * @type {loginService}
   */
  loginService,

  /**
   * `signupService` handles user registration by validating user input, ensuring email and username uniqueness, 
   * and creating a new user record in the system.
   * 
   * @type {signupService}
   */
  signupService,

  /**
   * `logoutService` handles user logout functionality, such as invalidating or removing the JWT token.
   * 
   * @type {logoutService}
   */
  logoutService,

  /**
   * `tokenService` provides methods for generating and verifying JWT tokens, used for authentication across the app.
   * 
   * @type {tokenService}
   */
  tokenService,
};

export default authService;