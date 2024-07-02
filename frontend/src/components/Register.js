import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const history = useHistory();

    let bp = require('./Path.js');

    const doRegister = async event => {
        event.preventDefault();

        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            setMessage('All fields must be filled out!');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        var obj = { 
            username: username,
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password
        };
        let js = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('api/register'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            let res = JSON.parse(await response.text());

            if ('error' in res) {
                setMessage(res.error);
            } else {
                setMessage('Registration successful! Please log in.');
                history.push('/login');
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    return (
        <div id="register-in-container">
            <div id="signUp-left-side"></div>
            <div id="signUp-right-side">
                <h1 id="signUp-heading">Create Account</h1>
                <h2 id="signUp-subheader">Already have an account? <a href="/login" className="links">Sign In</a></h2>
                <p id="name-text">First Name</p>
                <input type="text" id="firstName" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /><br />
                <p id="name-text">Last Name</p>
                <input type="text" id="lastName" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required /><br />
                <p id="username-text">Username</p> {/* Added username field */}
                <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />
                <p id="email-text">Email</p>
                <input type="email" id="emailInput" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
                <p id="password-text">Password</p>
                <input type="password" id="newPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
                <p id="confirm-password-text">Confirm Password</p>
                <input type="password" id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /><br />
                <button id="registerButton" type="submit" onClick={doRegister}>Register</button>
                <span id="registerResult">{message}</span>
            </div>
        </div>
    );
}

export default Register;
