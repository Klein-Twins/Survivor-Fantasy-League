import bcrypt from 'bcrypt';

// Function to check if the plain password matches the hashed password
async function checkPasswordsMatch(password: string, currentUserPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, currentUserPassword);
}

// Function to hash the password
async function getHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

// Function to check if the password is strong
function isPasswordStrong(password: string): boolean {
    const minLength = 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    // const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  
    return (
        password.length >= minLength &&
        hasLowercase &&
        hasUppercase &&
        hasNumber
        // hasSpecialChar
    );
}

export {
    checkPasswordsMatch,
    getHashedPassword,
    isPasswordStrong
};