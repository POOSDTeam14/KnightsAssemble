require('express');
require('mongodb');
const createAccessToken = require('./createJWT');

exports.setApp = function(app, client)
{
    // Login Incoming: 
    // Username : ""
    // Password : ""

    // Login Outgoing
    // FirstName : ""
    // LastName : ""
    // Email : ""
    app.post('/api/login', async (req, res, next) =>
    {
        // Get username and password from request body
        const {username, password} = req.body

        // Error handling for empty username or password
        if (!username || !password)
        {
            return res.status(400).json({ error: "Both a username and password are required!" });
        }

        // Check database's users collection to see if there is a matching login and password
        const db = client.db('KnightsAssembleDatabase');
        const results = await db.collection('Users').find({Username: username, Password: password}).toArray();

        // Initialize outgoing info
        var firstname = "";
        var lastname = "";
        var email = "";
        var userid = "";
        // outgoing results 
        var ret;
        // If matching user is found populate outgoing info
        if (results.length > 0)
        {
            firstname = results[0].FirstName;
            lastname = results[0].LastName;
            email = results[0].Email;
            userid = results[0]._id;

            const userInfo = {firstname, lastname, email, userid}; 
            // Create JWT
            const token = createAccessToken(userInfo);

            ret = {firstname: firstname, lastname: lastname, email: email, userid: userid, token: token};
        }
        else
        {
            ret = {error: "Username or password is incorrect!"};
        }

        res.status(200).json(ret);
    });
}
