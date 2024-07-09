import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
const { retrieveToken } = require('../tokenStorage.js');

function EventsUI()
{
    const getCookieData = async event => {
        event.preventDefault();
        alert(jwtDecode(retrieveToken(), {header: true}).firstname);
    };

    return(
        <div>
            <span id="data">{userData}</span>
            <button id="test" onClick={getCookieData}>test</button>
        </div>
    );
}

export default EventsUI;
