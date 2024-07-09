import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
const { retrieveToken } = require('../tokenStorage.js');

function EventsUI()
{
    const [userData, setUserData] = useState('');

    const getCookieData = async event => {
        event.preventDefault();
        let userInfo = jwtDecode(retrieveToken(), { header: true });
        alert(userInfo.firstname);
    };

    return(
        <div>
            <span id="data">{userData}</span>
            <button id="test" onClick={getCookieData}>test</button>
        </div>
    );
}

export default EventsUI;
