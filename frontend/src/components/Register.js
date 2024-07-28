import React, { useState } from 'react';
import VerificationCode from './VerificationCode';

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

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

    //Verification Popup
    const [showVerificationPopup, setShowVerificationPopup] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');


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
            setMessage('All fields must be filled out.');
            validInput = false;
            return;
        }

        //Name Format
        const firstNameRequirement = /^[A-Za-z]+$/.test(firstName);
        const lastNameRequirement = /^[A-Za-z]+$/.test(lastName);
        if (!firstNameRequirement) {
            setFirstNameRequirementNotMet("First name cannot contain numbers or special characters.")
            validInput = false;
        }
        if (!lastNameRequirement) {
            setLastNameRequirementNotMet("Last name cannot contain numbers or special characters.")
            validInput = false;
            return;
        }

        //Validate Email Format
        const emailRequirement = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailRequirement) {
            setEmailRequirementNotMet("Email address is not valid.")
            validInput = false;
            return;
        }

        //Validate Password
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            validInput = false;
            return;
        }

        const testRequirements = validatePassword(password);
        if(!testRequirements.isLengthMet){
            setlengthNotMet("Password length must be 8-16 characters.");
            validInput = false;
        }
        
        if(!testRequirements.isDigitMet){
            setDigitNotMet("Password must contain at least one number.");
            validInput = false;
        }
       
        if(!testRequirements.isUpperCaseMet){
            setUpperCaseNotMet("Password must contain at least one uppercase letter.");
            validInput = false;
        }

        if(!testRequirements.isLowerCaseMet){
            setLowerCaseNotMet("Password must contain at least one lowercase letter.");
            validInput = false;
            return
        }

        //Check if Email/Username Taken
        var obj = {
            email: email,
            username: username
        };
        let js = JSON.stringify(obj);
        try {
            const response = await fetch(bp.buildPath('api/checkExistingUser'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });
            
            let res = JSON.parse(await response.text());
            
            if ('error' in res) {
                setMessage(res.error);
                validInput = false;
            } else {
                setMessage("");
            }
        } catch (e) {
            alert(e.toString());
            return;
        }

        //Verify Email 
        if(validInput){
            var obj = {
                email: email
            };
            let js = JSON.stringify(obj);
            try {
                const response = await fetch(bp.buildPath('api/verifyEmail'), {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' }
                });
                
                let res = JSON.parse(await response.text());
                
                if ('error' in res) {
                    setMessage(res.error);
                } else {
                    setVerifyCode(res.verifyCode);
                    setShowVerificationPopup(true);
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

    const closeVerificationPopup = () => {
        setShowVerificationPopup(false);
    };

    const onVerificationSuccessful = async () =>{
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
            } else{
                window.location.href = "/login";
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    }

    return (
        <div className="row g-0 signUpRow ">
            <div className = "col h-100">
                <div className = "left-signUp"></div>
            </div>

            <div className = "col h-100">
                <div className="right-signUp">
                    <h1 id="signUp-heading">Create account</h1>
                    <h2 id="signUp-subheader">Already have an account? <a href="/login" className="links">Sign in</a></h2>

                    <div className = "signUp-nameRow">
                        <div className="colFirstName">
                            <p className="signUp-inputText">First name</p>
                            <input type="text" id="firstName" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="colLastName">
                            <p className="signUp-inputText">Last name</p>
                            <input type="text" id="lastName" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                    </div>

                    <p className = "signUp-inputText">Username</p>
                    <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />

                    <p className = "signUp-inputText">Email</p>
                    <input type="email" id="emailInput" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <p className = "signUp-inputText">Password</p>
                    <input type="password" id="newPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <p className = "signUp-inputText">Confirm password</p>
                    <input type="password" id="confirmPassword" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                    <span className="signUp-requirementFields">{message}</span>
                    <span className="signUp-requirementFields">{firstNameRequirementNotMet}</span>
                    <span className="signUp-requirementFields">{lastNameRequirementNotMet}</span>
                    <span className="signUp-requirementFields">{emailRequirementNotMet}</span>
                    <span className = "signUp-requirementFields">{lengthNotMet}</span>
                    <span className = "signUp-requirementFields">{lowerCaseNotMet}</span>
                    <span className="signUp-requirementFields">{upperCaseNotMet}</span>
                    <span className = "signUp-requirementFields">{digitNotMet}</span>
                    
                    <button id="registerButton" type="submit" onClick={doRegister}>Register</button>
                    </div>                    
                </div>
            {showVerificationPopup && <VerificationCode show={true} onClose={closeVerificationPopup} verifyCode = {verifyCode} verificationSuccessful = {onVerificationSuccessful}/>}   
        </div>


    );
}

export default Register;
