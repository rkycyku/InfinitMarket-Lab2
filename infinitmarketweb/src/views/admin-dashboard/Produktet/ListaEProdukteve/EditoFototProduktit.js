import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Spinner, Alert, Card, Row, Col, Table, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Styles/style.css';

function EditoFototProduktit(props) {
  const [produkti, setProdukti] = useState();
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [perditeso, setPerditeso] = useState(Date.now());

  const [fotot, setFotot] = useState(null);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseProdukti = await axios.get(
          `https://localhost:7251/api/Produktet/Produkti/ShfaqProduktinSipasIDsAll/${props.id}`,
          authentikimi
        );

        setProdukti(responseProdukti.data);
      } catch (error) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props.id, perditeso]);

  async function handleSubmit() {
    if (fotot != null && fotot.length > 0) {
      const formData = new FormData();
      fotot.forEach((foto) => {
        formData.append('fotot', foto);
      });

      try {
        await axios
          .post('https://localhost:7251/api/TeNdryshme/VendosFotot/ShtoProduktin', formData, authentikimi)
          .then(async (response) => {
            response.data.forEach(async (foto) => {
              await axios.post(
                'https://localhost:7251/api/Produktet/FototProduktit/VendosFotonEProduktitPerGallery',
                {
                  id: null,
                  produktiID: produkti && produkti.produkti && produkti.produkti.produktiId,
                  emriFotos: foto
                },
                authentikimi
              );
            });
            setPerditeso(Date.now());
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleFotoChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFotot(Array.from(files)); // Convert FileList to an array
    }
  };

  return (
    <Modal show={true} onHide={props.largo} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Edito Foto e Produktit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <div className="teDhenatProduktit">
              <table>
                <tbody>
                  <tr>
                    <td>ID Produktit:</td>
                    <td>{produkti && produkti.produkti && produkti.produkti.produktiId}</td>
                  </tr>
                  <tr>
                    <td>Emri Produktit:</td>
                    <td>{produkti && produkti.produkti && produkti.produkti.emriProduktit}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Form className="mt-4">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Foto Produktit</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control type="file" accept="image/*" placeholder="Foto e Produktit" onChange={handleFotoChange} multiple />
                  <Button variant="outline-secondary" onClick={() => handleSubmit()}>Vendos Fotot</Button>
                </InputGroup>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
        <Row>
          {produkti &&
            produkti.fotoProduktit &&
            produkti.fotoProduktit.map((foto) => (
              <Col>
                <Card className="PaGallery">
                  <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/img/produktet/${foto.emriFotos}`} />
                  <Card.Body>
                    <Button variant="primary">Zgjedh Foton Kryesore</Button>
                    <Button variant="primary">Largo Foton</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.largo} disabled={loading}>
          Anulo <FontAwesomeIcon icon={faTimes} />
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Ruaj'} <FontAwesomeIcon icon={faPenToSquare} />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditoFototProduktit;
