const jwt = require("jsonwebtoken");
require("dotenv").config();

function createAccessToken(userInfo) 
{
    return jwt.sign({ userInfo: userInfo }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

module.exports = createAccessToken;
