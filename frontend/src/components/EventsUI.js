import React, { useState } from 'react'

function EventsUI()
{
    const [userData, setUserData] = useState('');

    const getCookieData = async event => {
        event.preventDefault();
        setUserData(localStorage.getItem('user_data').id);
    };

    return(
        <span id="data">{userData}</span>
        <button id="test" onClick={getCookieData}>test</button>
    );
}

export default EventsUI;
