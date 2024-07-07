function createVerifyCode() 
{
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var verificationCode = "";
    const len = 4;

    for (let i = 0; i < len; i++)
    {
        const k = Math.floor(Math.random() * chars.length);
        verificationCode += chars[k];
    }
    return verificationCode;
}

module.exports = {createVerifyCode};