function storeToken(token)
{
    try 
    {
        localStorage.setItem('token_data', token.accessToken);
    }
    catch (e) 
    {
        console.log(e.message);
    }
}

function retrieveToken()
{
    let userData;
    try 
    {
        userData = localStorage.getItem('token_data');
    }
    catch (e) 
    {
        console.log(e.message);
    }
    
    return userData;
}

function storeEventID(eventID)
{
    try 
    {
        localStorage.setItem('eventID_data', eventID);
    }
    catch (e) 
    {
        console.log(e.message);
    }
}

function retrieveEventID() 
{
    let eventID;
    try 
    {
        eventID = localStorage.getItem('eventID_data');
    }
    catch (e) 
    {
        console.log(e.message);
    }
    
    return eventID;
}

function clearStorage()
{
    localStorage.clear();
}

module.exports = {storeToken, retrieveToken, storeEventID, retrieveEventID, clearStorage};