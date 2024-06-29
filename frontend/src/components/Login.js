import React, { useState } from 'react'
import ForgetPassword from './ForgetPassword.js';


function Login()
{
    let loginName;
    let loginPassword;

    const [message,setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    let bp = require('./Path.js');

   
    const doLogin = async event => 
      {
          event.preventDefault();
          var obj = {
            username: loginName.value,
            password: loginPassword.value
          };
          let js = JSON.stringify(obj);
  
          try
          {    
            const response = await fetch(bp.buildPath('api/login'), {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

  
              let res = JSON.parse(await response.text());
  
              if('error' in res)
              {
                  setMessage(res.error);
              }
              else
              {
                  let user = {
                    firstName:res.firstname,
                    lastName:res.lastname,
                    id:res.user
                  };
                  localStorage.setItem('user_data', JSON.stringify(user));
                  
      
                  setMessage('');
                  window.location.href = '/events';
              }
          }
          catch(e)
          {
              alert(e.toString());
              return;
          }    
      };

      const forgetPasswordClick = () => {
        setShowPopup(true);
      }

      const closePopup = () => {
        setShowPopup(false);
      }

    
  

    return(
      <div id="loginDiv">
         
        {/*Top Page Logo*/}
        <div class = "upperBox">
          <a href = "https://github.com/POOSDTeam14/KnightsAssemble">
            <img src='https://i.imgur.com/IhXxVvE.png' alt = "UCF Knight Logo"></img>
          </a>
          <p >Knights Assemble</p>
        </div>
        
        <div id = "login-in-container">
        
          <div id = "signIn-left-side"></div>

          <div id = "signIn-right-side">
            <h1 id="signIn-heading">Sign In</h1>
            <h2 id="signIn-subheader">New to Knights Assemble? <a href = "/register" class = "links">Create Account</a></h2>
            <p id="username-text">Username</p>
            <input type="text" id="loginName" placeholder="Username" ref = {(elem) => loginName = elem}/><br />
            <p id="password-text">Password</p>
            <input type="password" id="loginPassword" placeholder="Password" ref = {(elem) => loginPassword = elem}/><br />
  
            <a id ="forgot-password" class = "links" onClick={forgetPasswordClick}>Forgot Password</a>
            <ForgetPassword show = {showPopup} onClose = {closePopup} />

            <button id="loginButton" onClick={doLogin}>Sign In</button>
            <span id="loginResult">{message}</span>
          </div>

        </div>


        
     </div>
    );
};

export default Login;
