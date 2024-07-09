require('express');
const { ObjectId } = require('mongodb');
const {createAccessToken, isTokenExpired, refreshToken} = require('./createJWT');
const {createVerifyCode} = require('./createVerificationCode');

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
                ret = createAccessToken(userInfo);
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
        /*const userResults = await db.collection('Users').find({Username: username}).toArray();
        const emailResults = await db.collection('Users').find({Email: email}).toArray();

        // User name already exists
        if (userResults.length > 0)
        {
            return res.status(400).json({error: "Username already exists!"});
        }         
        
        // Email already exists
        if (emailResults.length > 0)
        {
            return res.status(400).json({error: "Email is already in use on this site!"});
        }*/       
             
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

    // checkExistingUser Incoming: 
    // Username : ""
    // Email : ""
    app.post('/api/checkExistingUser', async (req, res, next) =>
    {
        // Get username & email to see if an account is already registered with one of these
        const {username, email} = req.body

        // Check database's users collection to see if there is an existing username
        const db = client.db('KnightsAssembleDatabase');
        const userResults = await db.collection('Users').find({Username: username}).toArray();
        const emailResults = await db.collection('Users').find({Email: email}).toArray();

        // User name already exists
        if (userResults.length > 0)
        {
            return res.status(400).json({error: "Username already exists!"});
        }         
        
        // Email already exists
        if (emailResults.length > 0)
        {
            return res.status(400).json({error: "Email is already in use on this site!"});
        }
        
        return res.status(200).json({message: "Unique user information entered"});
    });

    // Create Incoming: 
    // Name : ""
    // Type : ""
    // Description : ""
    // Time : Date
    // Location : ""
    // Capacity : Int32
    /// HostID : 
    // Attendees : Array
    // Token
    app.post('/api/createEvent', async (req, res, next) =>
    {
        // Get name,type, description, time, location, and capacity from request body
        const {name, type, description, time, location, capacity, hostid, attendees, token} = req.body

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

    // Update Incoming: 
    // Name : ""
    // Type : ""
    // Description : ""
    // Time : Date
    // Location : ""
    // Capacity : Int32
    // eventid : ""
    // Token
    app.post('/api/updateEvent', async (req, res, next) =>
    {
        // Get all event parameters except for HostID and attendees (these probably should not change)
        const {name, type, description, time, location, capacity,eventid, token} = req.body
    
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

        const eventTime = new Date(time);
        // Make sure eventid is of type ObjectID for query
        var eventObjectId = new ObjectId(eventid);

        const db = client.db('KnightsAssembleDatabase');
        const results = await db.collection('Events').find({_id : eventObjectId}).toArray();

        // If matching event is found update info
        if (results.length > 0)
        {
            const updatedEvent = {
                Name : name,
                Type : type,
                Description: description,
                Time : eventTime,
                Location : location,
                Capacity : capacity
            };

            try 
            {
                var ret = await db.collection('Events').updateOne(
                    {_id : eventObjectId},
                    {$set : updatedEvent}
                );
                console.log("Update event result", ret);
            } 
            catch (error) 
            {
                console.log(error);
                return res.status(500).json({error: "Event not updated!"});
            }
        }
        else
        {
            return res.status(404).json({error: "Event not found!"});
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
    
    // Delete incoming:
    // eventid : ObjectID
    // token
    app.post('/api/deleteEvent', async (req, res, next) =>
    {
        // Get eventid (same as _id in db) to delete it
        const {eventid, token} = req.body
        
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

        // Make sure eventid is of type ObjectID for query
        var eventObjectId = new ObjectId(eventid);
    
        const db = client.db('KnightsAssembleDatabase');
        const results = await db.collection('Events').find({_id : eventObjectId}).toArray();
    
            // If matching event is found update info
            if (results.length > 0)
            {
                try 
                {
                    var ret = await db.collection('Events').deleteOne(
                        {_id : eventObjectId}
                    );
                } 
                catch (error) 
                {
                    console.log(error);
                    return res.status(500).json({error: "Event not deleted!"});
                }
            }
            else
            {
                return res.status(404).json({error: "Event not found!"});
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
    
    app.post('/api/joinEvent', async (req, res, next) =>
    {
        // Get eventid to add attendees to it
        const {eventid, userid, token} = req.body

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

        // Check user and event id
        var eventObjectId = new ObjectId(eventid);
    
        const db = client.db('KnightsAssembleDatabase');

        // Check to see if user is already joined event
        const userResult = await db.collection('Events').findOne(
        { _id: eventObjectId,
          Attendees: userid }     
        );
        // If so, do not add them
        if ( userResult )
        {
            return res.status(405).json({error: "User already joined!"});
        }

        // If event exists and passes the previous test, join event
        const eventResults = await db.collection('Events').find({_id : eventObjectId}).toArray();
        if ( eventResults.length>0 ) 
        {
            try
            {
                var ret = await db.collection('Events').updateOne(
                    { _id : eventObjectId},
                    { $push: { Attendees: userid } },
                    { upsert: true }
                );
            }
            catch (error) 
            {
                console.log(error);
                return res.status(500).json({error: "You have not been added to event!"});
            }
        }
        else
        {
            return res.status(404).json({error: "Event not found!"});
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

    // Verify email incoming:
    // email : ""
    // Verify email outgoing:
    // Code : 1234
    app.post('/api/verifyEmail', async (req, res, next) =>
    {
        // Get registering email and create a random code
        const {email} = req.body

        if (!email)
        {
            return res.status(400).json({error: "You must enter your email!"});
        }

        var verifyCode = createVerifyCode();


        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
        to: email, // Change to your recipient
        from: 'info@tsinghuarejects.com', // Change to your verified sender
        subject: 'KnightsAssemble Verification Code',
        text: 'Enter this verification code into the app: ' + verifyCode,
        html: '<strong>Enter this verification code into the app: ' + verifyCode + '</strong>',
        }

        sgMail
        .send(msg)
        .then((response) => {
            console.log("Verification code sent");
        })
        .catch((error) => {
            console.error(error)
        })

        // Respond with code
        res.status(200).json({verifyCode});
    });

    // Forgot password incoming:
    // email : ""
    // Forgot password outgoing:
    // Code : 1234
    app.post('/api/forgotPassword', async (req, res, next) =>
    {
        // Get user email and create a random code
        const {email} = req.body

        const db = client.db('KnightsAssembleDatabase');
    
        if (!email)
        {
            return res.status(400).json({error: "You must enter your email!"});
        }

        const emailResults = await db.collection('Users').find({Email: email}).toArray();    
        
        // Email exists so send code
        if (emailResults.length > 0)
        {
            var verifyCode = createVerifyCode();
        
        
            const sgMail = require('@sendgrid/mail')
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        
            const msg = {
            to: email, // Change to your recipient
            from: 'info@tsinghuarejects.com', // Change to your verified sender
            subject: 'KnightsAssemble Verification Code',
            text: 'Enter this code to reset your password: ' + verifyCode,
            html: '<strong>Enter this code to reset your password: ' + verifyCode + '</strong>',
            }
        
            sgMail
            .send(msg)
            .then((response) => {
                console.log("Verification code sent");
            })
            .catch((error) => {
            console.error(error)
            })

            return res.status(200).json({verifyCode});
        }
        else
        {
            return res.status(400).json({error: "This email is not associated with any account!"});
        }
    });

    // Update password incoming:
    // email : ""
    // password : ""
    // Update password outgoing:
    //
    app.put('/api/updatePassword', async (req, res, next) =>
    {
        // Take in user email and new password to update it
        const {email, password} = req.body

        const db = client.db('KnightsAssembleDatabase');

        const emailResults = await db.collection('Users').find({Email: email}).toArray();

        if (emailResults.length > 0)
        {
            try 
            {
                var ret = await db.collection('Users').updateOne(
                    {Email : email},
                    {$set : {Password : password}}
                );
                return res.status(200).json(ret);
            } 
            catch (error) 
            {
                return res.status(500).json({error: "Password not updated!"});
            }
        }
        else
        {
            return res.status(404).json({error: "User not found!"});
        }
    });
    /*
    app.post('/api/postMessage', async (req, res, next) =>
    {
        // Get eventid, userid, and message from request body
        const {eventid, userid, message, token} = req.body

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

        if ( !eventid | !userid | !message )
        {
            return res.status(400).json({error: "Need to know who sent what message to which event!"});
        }

        var eventObjectId = new ObjectId(eventid);
        const timePosted = new Date().ISOString();
        
        const db = client.db('KnightsAssembleDatabase');
        const eventResults = await db.collection('Events').find({_id : eventObjectId}).toArray();

        if ( eventResults.length>0 )
        {
            try 
            {
                var ret = await db.collection('Messages').insertOne(
                    { Event : eventid },
                    { User : userid },
                    { Text : message },
                    { TimePosted: timePosted };
                );
            } 
            catch (error) 
            {
                res.status(500).json({error: "Unable to send message"});
            }
        }
        else
        {
            return res.status(404).json({error: "Event not found!"});
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
    */
}
