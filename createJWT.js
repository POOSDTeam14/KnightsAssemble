const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

function createAccessToken(username)
{
    return jwt.sign({username: username}, ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
}

module.exports = createAccessToken;
