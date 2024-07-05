import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap';



function TopPageLogo(){
    return(
        <Container fluid className="upperBox">
        <Row className="align-items-center">
          <Col xs="auto">
            <a href="https://github.com/POOSDTeam14/KnightsAssemble">
              <img src="https://i.imgur.com/IhXxVvE.png" alt="UCF Knight Logo" className="img-fluid" />
            </a>
          </Col>
          <Col>
            <p className="mb-0">Knights Assemble</p>
          </Col>
        </Row>
      </Container>
    );
}

export default TopPageLogo;