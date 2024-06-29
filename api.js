require('express');
require('mongodb');
const {createAccessToken, isTokenExpired, refreshToken} = require('./createJWT');

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
    
            try
            {
                // Create JWT
                const token = createAccessToken(userInfo);
                ret = {firstname: firstname, lastname: lastname, email: email, userid: userid, token: token};
            }
            catch(error)
            {
                ret = {error:e.message};
            }
        }
        else
        {
            ret = {error: "Username or password is incorrect!"};
        }

        res.status(200).json(ret);
    });


    // Register Incoming: 
    // Username : ""
    // Password : ""
    // FirstName : ""
    // LastName : ""
    // Email : ""
    app.post('/api/register', async (req, res, next) =>
    {
        // Get username,password, firstname, lastname, and email from request body
        const {username, password, firstname, lastname, email} = req.body

        if (!username | !password | !firstname | !lastname | !email)
        {
            return res.status(400).json({error: "All fields must be filled out!"});
        }

        // Check database's users collection to see if there is an existing username
        const db = client.db('KnightsAssembleDatabase');
        const results = await db.collection('Users').find({Username: username}).toArray();

        // User name already exists
        if (results.length > 0)
        {
            return res.status(400).json({error: "Username already exists!"});
        }           
             
        const newUser = {
            Username: username,
            Password: password,
            FirstName: firstname,
            LastName: lastname,
            Email: email
        };
            
        try 
        {
            var ret = await db.collection('Users').insertOne(newUser);
            res.status(200).json(ret);
        } 
        catch (error) 
        {
            res.status(500).json({error: "User not registered"});
        }   
    });

    // Create Incoming: 
    // Name : ""
    // Type : ""
    // Description : ""
    // Time : Date
    // Location : ""
    // Capacity : Int32
    // Attendees : Array
    // Token
    app.post('/api/createEvent', async (req, res, next) =>
    {
        // Get name,type, description, time, location, and capacity from request body
        const {name, type, description, time, location, capacity, attendees, token} = req.body

        if (!name | !type | !description | !time | !location | !capacity)
        {
            return res.status(400).json({error: "All fields must be filled out!"});
        }

        // Possibly do some check for identical events?
        const db = client.db('KnightsAssembleDatabase');

        // Check for expired token
        try 
        {
            if (isTokenExpired(token))
            {
                return res.status(401).json({error: "Your session is no longer valid"});
            }
        } 
        catch (error) 
        {
            return res.status(401).json({error: "Something is wrong with your session"});
        }

        // Convert time to Date object because MongoDB might not be interpreting it correctly
        const eventTime = new Date(time);

        // Get host id this way
        const hostid = req.user._id;

        const newEvent = {
            Name : name,
            Type : type,
            Description : description,
            Time : eventTime,
            Location : location,
            Capacity : capacity,
            HostID : hostid,
            Attendees : attendees || [] // Defaults to empty array if no attendees entered
        };

        try 
        {
            var ret = await db.collection('Events').insertOne(newEvent);
        } 
        catch (error) 
        {
            res.status(500).json({error: "Event not created"});
        }

        // Refresh token at end of CRUD events
        var newToken = null;
        try 
        {
            newToken = refreshToken(token);
        } 
        catch (error) 
        {
            console.log(error);
        }

        // Respond with event and token
        res.status(200).json({ret, token: newToken});
    });
}
