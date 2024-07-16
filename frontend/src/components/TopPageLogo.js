import React from 'react';
const { clearStorage } = require('../storage.js');

function TopPageLogo() {

  const logoutClicked = () => {
    clearStorage();
    window.location.href = "/login";
  }


  return (
    <div className = "row g-0 upperBox">

      <div className = "col-5 topLeft-Column">
          <a href="https://github.com/POOSDTeam14/KnightsAssemble">
            <img src="https://i.imgur.com/IhXxVvE.png" alt="UCF Knight Logo" className="img-fluid" />
          </a>
          <p className="mb-0">Knights Assemble</p>
      </div> 

      <div className = "col-7 topRight-Column">
        {window.location.pathname === "/login" || window.location.pathname === "/register" || window.location.pathname === "/" ? null : <button className="logout-Button" onClick={logoutClicked}>LOGOUT</button>}
      </div>

    </div>
  );
}

export default TopPageLogo;
