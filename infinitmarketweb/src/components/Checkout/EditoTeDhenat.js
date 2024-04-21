import React from 'react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const EditoTeDhenat = (props) => {
  const [perdoruesi, setPerdoruesi] = useState([]);

  const [adresaZgjedhur, setAdresaZgjedhur] = useState('');

  const getID = localStorage.getItem('id');

  const getToken = localStorage.getItem('token');

  const navigate = useNavigate();

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const vendosPerdoruesin = async () => {
      try {
        const adresat = await axios.get(
          `https://localhost:7251/api/Perdoruesi/ShfaqAdresatPerdoruesit?idUserAspNet=${getID}`,
          authentikimi
        );

        const perdoruesi = await axios.get(`https://localhost:7251/api/Produktet/Shporta/ShfaqShporten?userID=${getID}`, authentikimi);

        setPerdoruesi(adresat.data);
        setAdresaZgjedhur(perdoruesi.data.adresa.adresaID);
      } catch (e) {
        console.error(e);
      }
    };

    vendosPerdoruesin();
  }, []);

  async function PerditesoAdresen(adresaID) {
    await axios.put(
      `https://localhost:7251/api/Produktet/Shporta/PerditesoAdresenNeShporte?userID=${getID}&adresaID=${adresaID}`,
      {},
      authentikimi
    );

    props.perditeso();
    props.setShfaqMesazhin();
    props.tipi('success');
    props.pershkrimi('Adresa u perditesua me sukses!');
    props.setMbyllPerditesoTeDhenat();
  }

  return (
    <>
      <Modal size="lg" className="modalEditoDhenat" show={true} onHide={() => props.setMbyllPerditesoTeDhenat()}>
        <Modal.Header closeButton>
          <Modal.Title>Perditeso Adresen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mt-1">
            {perdoruesi.map((item) => (
              <>
                <Col className="sm-4" key={item.adresaID}>
                  <Card bg={item.adresaID == adresaZgjedhur ? 'info' : 'dark'}>
                    <Card.Body>
                      <Card.Title style={{ color: 'white' }}>
                        {item.emri} {item.mbiemri}
                      </Card.Title>
                      <Card.Text style={{ color: 'white' }}>Email: {item.email}</Card.Text>
                      <Card.Text style={{ color: 'white' }}>Numri i telefonit: {item.nrKontaktit}</Card.Text>
                      <Card.Text style={{ color: 'white' }}>
                        {item.adresa}
                        <br />
                        {item.qyteti}, {item.zipKodi}
                        <br />
                        {item.shteti}
                      </Card.Text>
                      {item.adresaID == adresaZgjedhur ? (
                        <Button variant="light" disabled>
                          Adresa Aktuale <FontAwesomeIcon icon={faPenToSquare} />
                        </Button>
                      ) : (
                        <Button variant="light" onClick={() => PerditesoAdresen(item.adresaID)}>
                          Zgjedhni Adresen <FontAwesomeIcon icon={faPenToSquare} />
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Row>
              <Col>
                <Button variant="secondary" onClick={() => props.setMbyllPerditesoTeDhenat()}>
                  Anulo <FontAwesomeIcon icon={faXmark} />
                </Button>
              </Col>
              <Col>
                <Link to={'https://localhost:7251/Identity/Account/Manage/Adresat'}>
                  <Button variant="secondary">
                    Menaxho Adresat <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                </Link>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditoTeDhenat;
