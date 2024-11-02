const bcrypt = require('bcrypt');

async function checkPasswordsMatch(password, currentUserPassword) {
    return await bcrypt.compare(password, currentUserPassword);
}

async function getHashedPassword(password) {
    return await bcrypt.hash(password, 10);
}

module.exports = {
    checkPasswordsMatch,
    getHashedPassword
}