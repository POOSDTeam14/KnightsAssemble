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

        //console.log("Username input:", username, "Password input:", password);


        // Check database's users collection to see if there is a matching login and password
        const db = client.db('KnightsAssembleDatabase');
        const results = await db.collection('Users').find({Username: username, Password: password}).toArray();

        //console.log("Query results:", results);

        // Initialize outgoing info
        var firstname = "";
        var lastname = "";
        var email = "";
        // outgoing results 
        var ret;
        // If matching user is found populate outgoing info
        if (results.length > 0)
        {
            firstname = results[0].FirstName;
            lastname = results[0].LastName;
            email = results[0].Email;

            ret = {firstname: firstname, lastname: lastname, email: email};
        }
        else
        {
            ret = {error: "Username or password is incorrect!"};
        }
        res.status(200).json(ret);
    });
}
