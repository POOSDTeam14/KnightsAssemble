import React from 'react';

const [userData, setUserData] = useState('');

function PageTitle()
{
  const getCookieData = async event => 
  {
    event.preventDefault();
    setUserData(localStorage.getItem('user_data').id);
  };

   return(
    <div>
      <span id="data">{userData}</span>
      <button id="test" onClick={getCookieData}>test</button>
    </div>
   );
};

export default PageTitle;
