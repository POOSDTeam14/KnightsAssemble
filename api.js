require('express');
const { ObjectId } = require('mongodb');
const {createAccessToken, isTokenExpired, refreshToken} = require('./createJWT');
const {createVerifyCode} = require('./createVerificationCode');
const {hashUserPassword} = require ('./passwordHash');
const bcrypt = require('bcrypt');

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
        const results = await db.collection('Users').find({Username: username}).toArray();

        // Initialize outgoing info
        var firstname = "";
        var lastname = "";
        var email = "";
        var userid = "";
        // outgoing results 
        var ret;

        // user exists
        if (results.length > 0)
        {
            const hashedPassword = results[0].Password;

            const matchingPassword = await bcrypt.compare(password, hashedPassword);

            if (matchingPassword)
            {
                
                firstname = results[0].FirstName;
                lastname = results[0].LastName;
                email = results[0].Email;
                userid = results[0]._id;
                
                const userInfo = {firstname, lastname, email, userid}; 
                
                try
                {
                    // Create JWT
                    ret = {accessToken: createAccessToken(userInfo)};
                }
                catch(error)
                {
                    ret = {error:e.message};
                }
            }
            else
            {
                res.status(404).json({ error: "Username or password is incorrect!"});
            }
        }
        else
        {
            res.status(404).json({ error: "Username or password is incorrect!"});
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

        const db = client.db('KnightsAssembleDatabase');

        // hash the user's password
        const hashedPassword = await hashUserPassword(password);
                 
        const newUser = {
            Username: username,
            Password: hashedPassword, // We add in the newly hashed password
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

        // Convert hostid to objectid
        var hostObjectId = new ObjectId(hostid);

        const newEvent = {
            Name : name,
            Type : type,
            Description : description,
            Time : eventTime,
            Location : location,
            Capacity : capacity,
            HostID : hostObjectId,
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

    // findCreatedEvents incoming:
    // userid: ""
    // token: 
    app.post('/api/findCreatedEvents', async (req, res, next) =>
    {
        // Get eventid to add attendees to it
        const {userid, token} = req.body

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

        const db = client.db('KnightsAssembleDatabase');
        const curDate = new Date();
        var userObjectId = new ObjectId(userid);
        const searchTerms = {};
        searchTerms.$and = [
            { HostID: userObjectId },
            { Time: { $gte: curDate } }
        ];
        var eventResults = await db.collection('Events').find( searchTerms ).toArray();
        
        // Look for hostid==userid in all events, return to array if found
        if ( eventResults.length>0 )
            try
            {
                var ret = eventResults;
            }
            catch ( error )
            {
                return res.status(404).json({error: "Unable to find host user in Events!"});
            }
        else
        {
            return res.status(405).json({error: "User has not created any Events!"});
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


    // provideEventInfo incoming:
    // eventid: ""
    // token:
    app.post('/api/provideEventInfo', async (req, res, next) =>
    {
        // Get eventid to add attendees to it
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

        var eventObjectId = new ObjectId(eventid);
        const db = client.db('KnightsAssembleDatabase');
        var eventResults = await db.collection('Events').find( { _id: eventObjectId } ).toArray();
        
        // Look for hostid==userid in all events, return to array if found
        if ( eventResults.length>0 )
            try
            {
                var ret = eventResults[0];
            }
            catch ( error )
            {
                return res.status(404).json({error: "Unable to find event info!"});
            }
        else
        {
            return res.status(405).json({error: "No events!"});
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

    // search incoming:
    // name : ""
    // location : ""
    // search outgoing:
    // documents that contain matching keywords
    // token
    app.post('/api/searchEvent', async (req, res, next) =>
    {
        // Get name and location to search
        const {search, token} = req.body
            
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
    
        const db = client.db('KnightsAssembleDatabase');

        try
        {
            await db.collection('Events').createIndex({Name: "text", Location : "text"});
            console.log("Index created");
        }
        catch(error)
        {
            console.error("Error making index");
            return res.status(500).json({error: "Something went wrong creating search index"});
        }
        
        const searchTerms = {};

        if (search) 
        {
            searchTerms.$or = [
                { Name: { $regex: search, $options: 'i' } },
                { Location: { $regex: search, $options: 'i' } }
            ];
        }

        console.log("Search terms are: ", searchTerms);

        const searchResults = await db.collection('Events').find(searchTerms).toArray();

        console.log("Search results are: ", searchResults);
        
        // If matching event is found returns all documents with matching keywords
        if (searchResults.length > 0)
        {
            ret = searchResults;
        }
        else
        {
            return res.status(404).json({error: "No matches!"});
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
            
        // Respond with search result documents and token
        res.status(200).json({ret, token: newToken});
    });

    // filter incoming:
    // filter: ""
    // token:
    const moment = require('moment-timezone'); // Ensure moment-timezone is installed

    // Function to convert local date to UTC range
    const convertDateToUTC = (localDate) => {
        const startOfDayEST = moment.tz(localDate, 'America/New_York').startOf('day').toDate();
        const endOfDayEST = moment.tz(localDate, 'America/New_York').endOf('day').toDate();
        return {
            start: moment(startOfDayEST).utc().toDate(),
            end: moment(endOfDayEST).utc().toDate()
        };
    };

    // API route to filter events
    app.post('/api/filterEvents', async (req, res) => {
        const { type, date, search, token } = req.body;

        // Check for expired token
        try {
            if (isTokenExpired(token)) {
                return res.status(401).json({ error: "Your session is no longer valid" });
            }
        } catch (error) {
            return res.status(401).json({ error: "Something is wrong with your session" });
        }

        const db = client.db('KnightsAssembleDatabase');

        try {
            await db.collection('Events').createIndex({ Name: "text", Location: "text" });
            console.log("Index created");
        } catch (error) {
            console.error("Error making index");
            return res.status(500).json({ error: "Something went wrong creating search index" });
        }

        const curDate = new Date();
        const searchTerms = {};

        if (type && date) {
            const { start, end } = convertDateToUTC(date);
            searchTerms.$and = [
                { Type: { $regex: type, $options: 'i' } },
                { Time: { $gte: start } },
                { Time: { $lt: end } }
            ];
            searchTerms.$or = [
                { Name: { $regex: search, $options: 'i' } },
                { Location: { $regex: search, $options: 'i' } }
            ];
        } else if (type && !date) {
            searchTerms.$and = [
                { Type: { $regex: type, $options: 'i' } },
                { Time: { $gte: curDate } }
            ];
            searchTerms.$or = [
                { Name: { $regex: search, $options: 'i' } },
                { Location: { $regex: search, $options: 'i' } }
            ];
        } else if (date && !type) {
            const { start, end } = convertDateToUTC(date);
            searchTerms.$and = [
                { Time: { $gte: start } },
                { Time: { $lt: end } }
            ];
            searchTerms.$or = [
                { Name: { $regex: search, $options: 'i' } },
                { Location: { $regex: search, $options: 'i' } }
            ];
        } else {
            searchTerms.$and = [
                { Time: { $gte: curDate } }
            ];
            searchTerms.$or = [
                { Name: { $regex: search, $options: 'i' } },
                { Location: { $regex: search, $options: 'i' } }
            ];
        }

        console.log("Search terms are: ", searchTerms);

        try {
            const searchResults = await db.collection('Events').find(searchTerms).toArray();
            console.log("Search results are: ", searchResults);

            // Refresh token at end of CRUD events
            let newToken = null;
            try {
                newToken = refreshToken(token);
            } catch (error) {
                console.log(error);
            }

            // Respond with search result documents and token
            res.status(200).json({ ret: searchResults, token: newToken });
        } catch (error) {
            console.error("Error fetching events", error);
            res.status(500).json({ error: "An error occurred while fetching events" });
        }
    });

    // joinEvent incoming:
    // eventid: ""
    // userid: ""
    // token:
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
        var userObjectId = new ObjectId(userid);
    
        const db = client.db('KnightsAssembleDatabase');

        // Check to see if user is event creator
        const hostResult = await db.collection('Events').findOne(
        { _id: eventObjectId,
          HostID: userObjectId }     
        );
        // If so, do not add them
        if ( hostResult )
        {
            return res.status(405).json({error: "O, creator, do not humble yourself to our level!"});
        }

        // Check to see if user is already joined event
        const userResult = await db.collection('Events').findOne(
        { _id: eventObjectId,
          Attendees: userObjectId }     
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
                    { $push: { Attendees: userObjectId } },
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
    
    // findJoinedEvents incoming:
    // userid: ""
    // token:
    app.post('/api/findJoinedEvents', async (req, res, next) =>
    {
        // Get eventid to add attendees to it
        const {userid, token} = req.body

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
        
        const db = client.db('KnightsAssembleDatabase');
        const curDate = new Date();
        var userObjectId = new ObjectId(userid);
        const searchTerms = {};
        searchTerms.$and = [
            { Attendees: userObjectId },
            { Time: { $gte: curDate } }
        ];
        var eventResults = await db.collection('Events').find(searchTerms).toArray();
        
        // Look for user in all events, return to array if found
        if ( eventResults.length>0 )
            try
            {
                var ret = eventResults;
            }
            catch ( error )
            {
                return res.status(404).json({error: "Unable to find user in Events!"});
            }
        else
        {
            return res.status(405).json({error: "User is not in any current Events!"});
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

    // findNames incoming:
    // userid: ""
    // token:
    app.post('/api/findNames', async (req, res, next) =>
    {
        // Get userid to find names
        const {userid, token} = req.body

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
        
        const db = client.db('KnightsAssembleDatabase');
        var userObjectId = new ObjectId(userid);
        const searchTerms = {};
        searchTerms.$and = [
            { _id: userObjectId }
        ];
        var eventResults = await db.collection('Users').find(searchTerms).toArray();
        
        // Look for user in database, return to array if found
        if ( eventResults.length>0 )
            try
            {
                var ret = { first: eventResults[0].FirstName, last: eventResults[0].LastName };
            }
            catch ( error )
            {
                return res.status(404).json({error: "Unable to find user!"});
            }
        else
        {
            return res.status(405).json({error: "Weird, this user doesn't exist....!"});
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

    // leaveEvent incoming:
    // eventid: ""
    // userid: ""
    // token:
    app.post('/api/leaveEvent', async (req, res, next) =>
    {
        // Get eventid to remove attendees from it
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
        var userObjectId = new ObjectId(userid);
    
        const db = client.db('KnightsAssembleDatabase');

        // Check to see if user is event creator
        const hostResult = await db.collection('Events').findOne(
        { _id: eventObjectId,
          HostID: userObjectId }     
        );
        // If so, do not add them
        if ( hostResult )
        {
            return res.status(405).json({error: "O, creator, please don't leave us!"});
        }

        // Check to see if user isn't in the event
        const userResult = await db.collection('Events').findOne(
            { _id: eventObjectId,
            Attendees: userObjectId }     
        );
        // If so, do not add them
        if ( !userResult )
        {
            return res.status(405).json({error: "User not in event!"});
        }

        // If event exists and passes the previous test, leave event
        const eventResults = await db.collection('Events').find({_id : eventObjectId}).toArray();
        if ( eventResults.length>0 ) 
        {
            try
            {
                var ret = await db.collection('Events').updateOne(
                    { _id : eventObjectId},
                    { $pull: { Attendees: userObjectId } },
                    { upsert: true }
                );
            }
            catch (error) 
            {
                console.log(error);
                return res.status(500).json({error: "You have not left the event!"});
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

        const hashedPassword = await hashUserPassword(password);

        if (emailResults.length > 0)
        {
            try 
            {
                var ret = await db.collection('Users').updateOne(
                    {Email : email},
                    {$set : {Password : hashedPassword}}
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

    // postMessage incoming:
    // eventid: ""
    // userid: ""
    // message: ""
    // token:
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

        // Variable created for document
        var eventObjectId = new ObjectId(eventid);
        var userObjectId = new ObjectId(userid);
        const timePosted = new Date();
        
        const db = client.db('KnightsAssembleDatabase');
        const eventResults = await db.collection('Events').find({_id : eventObjectId}).toArray();

        // If no events match the ID, do not send message
        if ( eventResults.length>0 )
        {
            try 
            {
                const newMessage = 
                    { Text : message,
                      TimePosted: timePosted,
                      Event : eventObjectId,
                      User : userObjectId
                    };
                
                var ret = await db.collection('Messages').insertOne( newMessage );
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

    // findJoinedEvents incoming:
    // eventid: ""
    // token:
    app.post('/api/getEventMessages', async (req, res, next) =>
    {
        // Get eventid to add attendees to it
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

        var eventObjectId = new ObjectId(eventid);
        
        const db = client.db('KnightsAssembleDatabase');
        var messageResults = await db.collection('Messages').find( { Event: eventObjectId } ).toArray();
        
        // Look for messages in this event, return to array if found
        if ( messageResults.length>0 )
            try
            {
                var ret = messageResults;
            }
            catch ( error )
            {
                return res.status(404).json({error: "Unable to find messages for this event!"});
            }
        else
        {
            return res.status(405).json({error: "No messages for this event!"});
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

    // markLocation incoming:
    // lat: double
    // long: double
    // title: ""
    // token:
    app.post('/api/markLocation', async (req, res, next) =>
    {
        // Get eventid to add attendees to it
        const {location, token} = req.body

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
    
        const db = client.db('KnightsAssembleDatabase');

        if ( location )
        {
            try
            {
                switch ( true )
                {
                    case location.includes('CB1'):
                        ret = {lat: 28.60393, long: -81.20044};
                        break;
                    case location.includes('CB2'):
                        ret = {lat: 28.60439, long: -81.20033};
                        break;
                    case location.includes('ENG1'):
                        ret = {lat: 28.60158, long: -81.19828};
                        break;
                    case location.includes('ENG2'):
                        ret = {lat: 28.60200, long: -81.19874};
                        break;
                    case location.includes('HS1'):
                        ret = {lat: 28.60306, long: -81.19865};
                        break;
                    case location.includes('HS2'):
                        ret = {lat: 28.60324, long: -81.19816};
                        break;
                    case location.includes('BA1'):
                        ret = {lat: 28.60123, long: -81.19909};
                        break;
                    case location.includes('BA2'):
                        ret = {lat: 28.60090, long: -81.19872};
                        break;
                    case location.includes('TCH'):
                        ret = {lat: 28.60206, long: -81.20323};
                        break;
                    case location.includes('PSY'):
                        ret = {lat: 28.60497, long: -81.19936};
                        break;
                    case location.includes('HEC'):
                        ret = {lat: 28.60062, long: -81.19773};
                        break;
                    case location.includes('ARB'):
                        ret = {lat: 28.60069, long: -81.19681};
                        break;
                    case location.includes('PSB'):
                        ret = {lat: 28.59992, long: -81.19865};
                        break;
                    case location.includes('BIO'):
                        ret = {lat: 28.60017, long: -81.19865};
                        break;
                    case location.includes('CHEM'):
                        ret = {lat: 28.59998, long: -81.19970};
                        break;
                    case location.includes('MSB'):
                        ret = {lat: 28.59949, long: -81.20050};
                        break;
                    case location.includes('LIB'):
                        ret = {lat: 28.60048, long: -81.20142};
                        break;
                    case location.includes('TA'):
                        ret = {lat: 28.59929, long: -81.20396};
                        break;
                    case location.includes('BHC'):
                        ret = {lat: 28.60231, long: -81.20181};
                        break;
                    case location.includes('VAB'):
                        ret = {lat: 28.60283, long: -81.20302};
                        break;
                    case location.includes('PAC'):
                        ret = {lat: 28.60256, long: -81.20454};
                        break;
                    case location.includes('CAH'):
                        ret = {lat: 28.60442, long: -81.20256};
                        break;
                    case location.includes('NSC'):
                        ret = {lat: 28.60395, long: -81.20293};
                        break;
                    case location.includes('CSB'):
                        ret = {lat: 28.60106, long: -81.20006};
                        break;
                    case location.includes('RWC'):
                        ret = {lat: 28.59563, long: -81.19947};
                        break;
                    case location.includes('Memory Mall'):
                        ret = {lat: 28.60479, long: -81.19880};
                        break;
                    case location.includes('STUN'):
                        ret = {lat: 28.60189, long: -81.20048};
                        break;
                    case location.includes('ARNA'):
                        ret = {lat: 28.60757, long: -81.19734};
                        break;
                    default:
                        return res.status(404).json({error: "Could not find location on map"});
                        break;
                }
            }
            catch (error)
            {
                return res.status(405).json({error: "Something went wrong trying to find location on map"});
            }
        }
        else
        {
            return res.status(404).json({error: "Location invalid"});
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
