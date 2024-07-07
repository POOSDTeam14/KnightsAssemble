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

    //Password Requirements Message
    const [lengthNotMet, setlengthNotMet] = useState("");
    const [upperCaseNotMet, setUpperCaseNotMet] = useState("");
    const [lowerCaseNotMet, setLowerCaseNotMet] = useState("");
    const [digitNotMet, setDigitNotMet] = useState("");

    //Email Requirements Message
    const [emailRequirementNotMet, setEmailRequirementNotMet] = useState("");

    //Name Requirement Message
    const [firstNameRequirementNotMet, setFirstNameRequirementNotMet] = useState("");
    const [lastNameRequirementNotMet, setLastNameRequirementNotMet] = useState("");


    let bp = require('./Path.js');

    const doRegister = async event => {
        event.preventDefault();

        let validInput = true;

        //Reset Error Messgages
        setMessage("");
        setlengthNotMet("");
        setDigitNotMet("");
        setUpperCaseNotMet("");
        setLowerCaseNotMet("");
        setEmailRequirementNotMet("");
        setLastNameRequirementNotMet("");
        setFirstNameRequirementNotMet("");

        //Validate All Inputs Filled
        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            setMessage('All fields must be filled out!');
            validInput = false;
            return;
        }

        //Validate Password
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            validInput = false;
            return;
        }

        const testRequirements = validatePassword(password);
        if(!testRequirements.isLengthMet){
            setlengthNotMet("Password Length Must Be 8-16 Characters");
            validInput = false;
        }
        
        if(!testRequirements.isDigitMet){
            setDigitNotMet("Password Must Contain At Least One Digit");
            validInput = false;
        }
       
        if(!testRequirements.isUpperCaseMet){
            setUpperCaseNotMet("Password Must Contain At Least One UpperCase Letter");
            validInput = false;
        }

        if(!testRequirements.isLowerCaseMet){
            setLowerCaseNotMet("Password Must Contain At Least One LowerCase Letter");
            validInput = false;
            return;
        }

        //Validate Email Format
        const emailRequirement = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if(!emailRequirement){
            setEmailRequirementNotMet("Email Address is Not Valid")
            validInput = false;
            return;
        }

        //First Name Format
        const firstNameRequirement = /^[A-Za-z]+$/.test(firstName);
        const lastNameRequirement = /^[A-Za-z]+$/.test(lastName);
        if(!firstNameRequirement){
            setFirstNameRequirementNotMet("First name cannot contain numbers or special characters")
            validInput = false;
        }
        if(!lastNameRequirement){
            setLastNameRequirementNotMet("First name cannot contain numbers or special characters")
            validInput = false;
            return;
        }
        
        if(validInput){
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
        }
    };

    const validatePassword = (password) => {
        const lengthRequirement = password.length >= 8 && password.length <= 16;
        const upperCaseRequirement = /[A-Z]/.test(password);
        const lowerCaseRequirement= /[a-z]/.test(password);
        const digitRequirement = /[0-9]/.test(password); 

        const requirements = {
            isLengthMet: lengthRequirement,
            isUpperCaseMet: upperCaseRequirement,
            isLowerCaseMet: lowerCaseRequirement,
            isDigitMet: digitRequirement
        };

        return requirements;
    };

    return (
        <div className="row g-0 signUpRow ">

            <div className = "col h-100">

                <div className = "left-signUp">
                </div>

            </div>

            <div className = "col h-100">
                <div className="right-signUp">
                    <h1 id="signUp-heading">Create Account</h1>
                    <h2 id="signUp-subheader">Already have an account? <a href="/login" className="links">Sign In</a></h2>

                    <div className = "row signUp-nameRow">
                        <div className = "col h-100">
                            <p className = "signUp-inputText">First Name</p>
                            <input type="text" id="firstName" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /><br />
                        </div>

                        <div className = "col h-100">
                            <p className = "signUp-inputText">Last Name</p>
                            <input type="text" id="lastName" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required /><br />
                        </div>
                    </div>

                    <div className = "row signUp-usernameRow">
                        <div className = "col h-100">
                            <p className = "signUp-inputText">Username</p> {/* Added username field */}
                            <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />
                        </div>
                    </div>

                    <div className = "row signUp-emailRow">
                        <div className = "col h-100">
                            <p className = "signUp-inputText">Email</p>
                            <input type="email" id="emailInput" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
                        </div>
                    </div>
                    
                    <div className = "row signUp-passwordRow">
                        <div className = "col h-100">
                            <p className = "signUp-inputText">Password</p>
                            <input type="password" id="newPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
                        </div>
                    </div>

                    <div className = "row signUp-confirmPasswordRow">
                        <div className = "col h-100">
                            <p className = "signUp-inputText">Confirm Password</p>
                            <input type="password" id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /><br />
                        </div>
                    </div>
                    <span className="signUp-requirementFields">{message}</span>
                    <span className = "signUp-requirementFields">{lengthNotMet}</span>
                    <span className = "signUp-requirementFields">{upperCaseNotMet}</span>
                    <span className = "signUp-requirementFields">{lowerCaseNotMet}</span>
                    <span className = "signUp-requirementFields">{digitNotMet}</span>
                    <span className = "signUp-requirementFields">{emailRequirementNotMet}</span>
                    <span className = "signUp-requirementFields">{firstNameRequirementNotMet}</span>
                    <span className = "signUp-requirementFields">{lastNameRequirementNotMet}</span>
                    
                    <div className = "row signUp-registerButton">
                        <div className = "col h-100">
                            <button id="registerButton" type="submit" onClick={doRegister}>Register</button>
                        </div>
                    </div>
                                        
                    
                </div>
            </div>
        </div>


    );
}

export default Register;