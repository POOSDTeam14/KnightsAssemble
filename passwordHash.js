const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashUserPassword(userPassword) 
{
    try 
    {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(userPassword, salt);
        return hashedPassword;
    } 
    catch (error) 
    {
        console.log(error);
        return;
    }
}

(async () => {
    try 
    {
        const hashedPassword = await hashUserPassword(userPassword);
    } 
    catch (error) 
    {
        console.log(error);
    }
})();

module.exports = {hashUserPassword};