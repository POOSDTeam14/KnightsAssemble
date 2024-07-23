import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
const { retrieveToken } = require('../storage.js');

function EventDetails()
{
    return (
    <div class="container">
        <div class="content">
            <div class="row">
                <div class="col-md-8">
                    <h1 class="h2">Event Name</h1>
                    <p><strong>Event Type:</strong> Type</p>
                    <p><strong>Date:</strong> mm/dd/yyyy</p>
                    <p><strong>Time:</strong> 00:00</p>
                    <p><strong>Location:</strong> location</p>
                    <p><strong>Description:</strong></p>
                    <p>Bello</p>
                </div>
                <div class="col-md-4">
                    <div class="chat-box">
                        <p><strong>Person1:</strong> I can't wait for this event!!!</p>
                        <p><strong>Person2:</strong> Who's bringing the drinks?</p>
                        <p><strong>Person3:</strong> I can bring the drinks if you want?</p>
                        <p><strong>Person2:</strong> I'm thirsty for anything!!!</p>
                    </div>
                    <input type="text" class="form-control" placeholder="Chat"></input>
                </div>
            </div>
        </div>
    </div>
    )
}

export default EventDetails;