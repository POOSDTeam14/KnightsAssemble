const jwt = require("jsonwebtoken");
require("dotenv").config();

function createAccessToken(username) {
    return jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

module.exports = createAccessToken;
