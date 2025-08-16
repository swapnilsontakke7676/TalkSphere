// backend/config/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;