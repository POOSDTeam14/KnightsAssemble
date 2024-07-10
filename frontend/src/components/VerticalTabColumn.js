import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap';



function VerticalTabColumn(){
    return(
        <div class="row g-0 verticalTabRow">
            <div class="col h-100">
                <div class = "verticalTabContent">
                    <a href="/events">
                        <p>Events</p>
                    </a>
                    <a href="/myevents">
                        <p>My Events</p>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default VerticalTabColumn;