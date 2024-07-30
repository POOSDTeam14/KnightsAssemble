import React from 'react';

function VerticalTabColumn() {
    return (
        <div className="row g-0 verticalTabRow">
            <div className="col h-100">
                <div className="verticalTabContent">
                    <a href="/events">
                        <p>Events</p>
                    </a>
                    <a href="/myevents">
                        <p>My events</p>
                    </a>
                    <a href="/createevent">
                        <p>Create event</p>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default VerticalTabColumn;