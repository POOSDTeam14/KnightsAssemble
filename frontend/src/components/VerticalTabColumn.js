import React from 'react';

function VerticalTabColumn() {
    return (
        <div className="verticalTabColumn">
            <a href="/events" className="verticalTabLink">
                <p>Events</p>
            </a>
            <a href="/myevents" className="verticalTabLink">
                <p>My events</p>
            </a>
            <a href="/createevent" className="verticalTabLink">
                <p>Create event</p>
            </a>
        </div>
    );
}

export default VerticalTabColumn;