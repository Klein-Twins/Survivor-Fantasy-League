export interface SignUpFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

export interface LogInFormData {
    email: string;
    password: string;
}

export const validateSignUp = (values: SignUpFormData) => {
    const errors: Partial<Record<keyof SignUpFormData, string>> = {};
    if (!/^[A-Za-z0-9]+$/.test(values.username)) {
        errors.username = "Username can only contain letters and numbers";
    }
    if (values.username.length < 7) {
        errors.username = "Username must be at least 7 characters long";
    }
    if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Please enter a valid email address";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(values.password)) {
        errors.password = "Password must be at least 8 characters long, include at least 1 uppercase letter, 1 lowercase letter, and 1 number, and can include special characters";
    }
    if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }
    if (values.firstName && !/^[A-Za-z]*$/.test(values.firstName)) {
        errors.firstName = "First Name can only contain letters";
    }
    if (values.lastName && !/^[A-Za-z]*$/.test(values.lastName)) {
        errors.lastName = "Last Name can only contain letters";
    }
    return errors;
};

export const validateLogin = (values: LogInFormData) => {
    const errors: Partial<Record<keyof LogInFormData, string>> = {};
    if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Please enter a valid email address";
    }
    if (values.password.length === 0) {
        errors.password = "Please enter password";
    }
    return errors;
};