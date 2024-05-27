import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Card, Col, Row } from 'react-bootstrap';
import '../../Styles/Produkti.css';
import KontrolloAksesinNeFunksione from '../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione';

function EditoRoletStafit(props) {
  const [stafi, setStafi] = useState([]);

  const [perditeso, setPerditeso] = useState('');
  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const shfaqKompanit = async () => {
      try {
        const stafi = await axios.get(`https://localhost:7251/api/Perdoruesi/Stafi/ShfaqStafinPerPerditesim?ID=${props.id}`, authentikimi);
        setStafi(stafi.data);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqKompanit();
  }, [perditeso]);

  async function ShtoRolin(roli) {
    await axios
      .post(`https://localhost:7251/api/Perdoruesi/Stafi/ShtoRolinStafit?userID=${props.id}&roli=${roli}`, {}, authentikimi)
      .then((x) => {
        setPerditeso(Date.now());
        props.perditesoTeDhenat();
      })
      .catch((error) => {
        console.error('Error saving stafi:', error);
        props.setTipiMesazhit('danger');
        props.setPershkrimiMesazhit('Ndodhi nje gabim gjate perditesimit te kompanis!');
        props.perditesoTeDhenat();
        props.shfaqmesazhin();
      });
  }
  async function FshijRolin(roli) {
    var eshteVetem1Admin = await axios.get(`https://localhost:7251/api/Perdoruesi/Stafi/EshteVetem1Admin`, authentikimi);

    console.log(eshteVetem1Admin);

    if (eshteVetem1Admin.data == false) {
      await axios
        .delete(`https://localhost:7251/api/Perdoruesi/Stafi/FshijRolinStafit?userID=${props.id}&roli=${roli}`, authentikimi)
        .then((x) => {
          setPerditeso(Date.now());
          props.perditesoTeDhenat();
        })
        .catch((error) => {
          console.error('Error saving stafi:', error);
          props.setTipiMesazhit('danger');
          props.setPershkrimiMesazhit('Ndodhi nje gabim gjate perditesimit te rolit!');
          props.perditesoTeDhenat();
          props.shfaqmesazhin();
        });
    } else {
      props.setTipiMesazhit('danger');
      props.setPershkrimiMesazhit(`<p><span>Ky role nuk mund te fshihet pasi qe eshte Admini i vetem!</span></p>
      <p><span>Ju lutem vendosni Admin tjeter dhe pastaj modifikoni kete!</span></p> `);
      props.perditesoTeDhenat();
      props.shfaqmesazhin();
      props.largo();
    }
  }

  return (
    <>
      <KontrolloAksesinNeFunksione
        largo={() => props.largo()}
        shfaqmesazhin={() => props.shfaqmesazhin()}
        perditesoTeDhenat={() => props.perditesoTeDhenat()}
        setTipiMesazhit={(e) => props.setTipiMesazhit(e)}
        setPershkrimiMesazhit={(e) => props.setPershkrimiMesazhit(e)}
      />

      {fushatEZbrazura && (
        <Modal size="sm" show={fushatEZbrazura} onHide={() => setFushatEZbrazura(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'red' }} as="h6">
              Ndodhi nje gabim
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong style={{ fontSize: '10pt' }}>
              Ju lutemi plotesoni te gjitha fushat me <span style={{ color: 'red' }}>*</span>
            </strong>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" onClick={() => setFushatEZbrazura(false)} variant="secondary">
              Mbylle <FontAwesomeIcon icon={faXmark} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal size="lg" className="modalEditShto" show={true} onHide={() => props.largo()}>
        <Modal.Header closeButton>
          <Modal.Title>Edito Rolet e Stafit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <div className="teDhenatProduktit">
                <table>
                  <tbody>
                    <tr>
                      <td>ID Stafit:</td>
                      <td>{stafi.userID}</td>
                    </tr>
                    <tr>
                      <td>Emri dhe Mbiemri:</td>
                      <td>{stafi.emri + ' ' + stafi.mbiemri}</td>
                    </tr>
                    <tr>
                      <td>Email:</td>
                      <td>{stafi.email}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>Rolet aktuale</Card.Header>
            <Card.Body>
              <Row>
                {stafi &&
                  stafi.roletPerdoruesit &&
                  stafi.roletPerdoruesit
                    .filter((roli) => roli != 'Klient')
                    .map((roli) => (
                      <Col key={roli}>
                        <Card>
                          <Card.Body>
                            <div className="teDhenatProduktit mb-3">
                              <table>
                                <tbody>
                                  <tr>
                                    <td>Roli:</td>
                                    <td>{roli}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <Button variant="danger" onClick={() => FshijRolin(roli)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
              </Row>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>Rolet e Lira</Card.Header>
            <Card.Body>
              <Row>
                {stafi &&
                  stafi.roletELejuaraPerVendosje &&
                  stafi.roletELejuaraPerVendosje
                    .filter((roli) => roli != 'Klient')
                    .map((roli) => (
                      <Col key={roli}>
                        <Card>
                          <Card.Body>
                            <div className="teDhenatProduktit mb-3">
                              <table>
                                <tbody>
                                  <tr>
                                    <td>Roli:</td>
                                    <td>{roli}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <Button variant="success" onClick={() => ShtoRolin(roli)}>
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.largo()}>
            Anulo <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditoRoletStafit;
