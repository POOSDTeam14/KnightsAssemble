const app_name = 'knightsassemble-c02217fc9059'
exports.buildPath =
function buildPath(route)
{
    if (process.env.Node_ENV === 'production')
    {
        return 'https://' + app_name + '.herokuapp.com/' + route;
    }

    else
    {
        return 'https://localhost:5000/' + route;
    }
}