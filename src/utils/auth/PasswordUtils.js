function isPasswordStrongEnough(password) {
  const minLength = 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  //const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

  if (
    password.length >= minLength &&
    hasLowercase &&
    hasUppercase &&
    hasNumber
    //hasSpecialChar
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  isPasswordStrongEnough,
};
