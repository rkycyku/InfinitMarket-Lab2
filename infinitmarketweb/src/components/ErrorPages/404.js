import { Col, Image, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

function NukUGjet(props) {
  return (
    <>
      <div className="containerDashboardP d-flex justify-content-center align-items-center">
        <Helmet>
          <title>Nuk u Gjet | Infinit Market</title>
        </Helmet>
        <div className="teDhenatAplikimit">
          <div className="teDhenatAplikimitHeader">
            <Row className="mb-4 align-items-center justify-content-center">
              <Col xs="12" sm="6" className="text-center">
                <Image
                  src={`${process.env.PUBLIC_URL}/img/InfiniteMarketLogo/default_crop.png`}
                  style={{ marginTop: '0.5em' }}
                  fluid
                  alt="Partner Logo 1"
                />
              </Col>
            </Row>
            <Row className="mb-4 align-items-center justify-content-center">
              <Col xs="12" sm="10" className="text-center">
                <h1 style={{ marginTop: '1em' }}>404 - Na vjen keq, por nuk mund të gjejmë atë që po kërkoni</h1>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}

export default NukUGjet;
