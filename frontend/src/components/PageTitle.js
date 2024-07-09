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
      <title id="title">Knights Assemble</title>
   );
};

export default PageTitle;
