import React from 'react';
import PageTitle from '../components/PageTitle';
import TopPageLogo from '../components/TopPageLogo';
import UpdateEvent from '../components/UpdateEvent';
import VerticalTabColumn from '../components/VerticalTabColumn';

const UpdateEventPage = () => {
  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0">
        <div className="col">
          <PageTitle />
          <TopPageLogo />
        </div>
      </div>
      <div className="row g-0">
        <div className="col-2" style={{ minWidth: "90px", maxWidth: "90px" }}>
          <VerticalTabColumn />
        </div>
        <div className="col">
          <UpdateEvent />
        </div>
      </div>
    </div>
  );
};

export default UpdateEventPage;
