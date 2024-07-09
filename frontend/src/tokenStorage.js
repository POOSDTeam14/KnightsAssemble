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