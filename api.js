require('express');
require('mongodb');

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

        // Check database's users collection to see if there is a matching login and password
        const db = client.db();
        const results = await db.collection('Users').find({Username: username, Password: password}).toArray();

        // Initialize outgoing info
        var firstname = "";
        var lastname = "";
        var email = "";

        var ret;
        // If matching user is found populate outgoing info
        if (results.length > 0)
        {
            firstname = results[0].FirstName;
            lastname = results[0].LastName;
            email = results[0].Email;
        }
        else
        {
            ret = {error: "Username or password is incorrect!"};
        }
        var ret = {firstname:firstname, lastname:lastname, email:email};
        res.status(200).json(ret);
    });
}
