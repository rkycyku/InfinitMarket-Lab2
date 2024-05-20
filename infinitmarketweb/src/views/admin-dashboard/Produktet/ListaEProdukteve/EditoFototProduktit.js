import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Spinner, Alert, Card, Row, Col, Table, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Styles/style.css';
import KontrolloAksesin from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione.js';
import KontrolloAksesinNeFunksione from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione.js';

function EditoFototProduktit(props) {
  const [produkti, setProdukti] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  async function fshijFoton(fotoID, emriFotos) {
    try {
      await axios.delete(`https://localhost:7251/api/Produktet/FototProduktit/FshijFotonEProduktitPerGallery?id=${fotoID}`, authentikimi);
      setPerditeso(Date.now());

      await new Promise((resolve) => setTimeout(resolve, 100));

      const updatedProdukti =
        produkti &&
        produkti.produkti &&
        (await axios.get(`https://localhost:7251/api/Produktet/Produkti/ShfaqProduktinSipasIDsAll/${props.id}`, authentikimi)).data;

      if (updatedProdukti && updatedProdukti.produkti && updatedProdukti.produkti.fotoProduktit === emriFotos) {
        await axios.put(
          `https://localhost:7251/api/Produktet/Produkti/PerditesoProduktin/${updatedProdukti.produkti.produktiId}`,
          {
            ProduktiId: props.id,
            FotoProduktit: updatedProdukti.fotoProduktit.length > 0 ? updatedProdukti.fotoProduktit[0].emriFotos : 'ProduktPaFoto.png'
          },
          authentikimi
        );
        setPerditeso(Date.now());
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function VendosFotoKryesore(emriFotos) {
    try {
      await axios.put(
        `https://localhost:7251/api/Produktet/Produkti/PerditesoProduktin/${props.id}`,
        {
          ProduktiId: props.id,
          FotoProduktit: emriFotos
        },
        authentikimi
      );
      setPerditeso(Date.now());
      props.perditesoTeDhenat();
    } catch (error) {
      console.error(error);
    }
  }

  const handleFotoChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFotot(Array.from(files)); // Convert FileList to an array
    }
  };

  return (
    <>
      <KontrolloAksesinNeFunksione
        largo={() => setShfaqEditoFotot(false)}
        shfaqmesazhin={() => setShfaqMesazhin(true)}
        perditesoTeDhenat={() => setPerditeso(Date.now())}
        setTipiMesazhit={(e) => props.setTipiMesazhit(e)}
        setPershkrimiMesazhit={(e) => props.setPershkrimiMesazhit(e)}
      />
      <Modal
        show={true}
        onHide={() => {
          props.largo();
          props.perditesoTeDhenat();
        }}
        size="xl"
      >
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
                    <tr>
                      <td>Foto Kryesore:</td>
                      <td>{produkti && produkti.produkti && produkti.produkti.fotoProduktit}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Form className="mt-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Foto Produktit</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control type="file" accept="image/*" placeholder="Foto e Produktit" onChange={handleFotoChange} multiple />
                    <Button variant="outline-secondary" onClick={() => handleSubmit()}>
                      Vendos Fotot
                    </Button>
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
                  <Card style={{ width: '25em' }} className="PaGallery">
                    <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/img/produktet/${foto.emriFotos}`} />
                    <Card.Body>
                      <div className="teDhenatProduktit mb-3">
                        <table>
                          <tbody>
                            <tr>
                              <td>ID:</td>
                              <td>{foto.id}</td>
                            </tr>
                            <tr>
                              <td>Emri:</td>
                              <td>{foto.emriFotos}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {produkti && produkti.produkti && produkti.produkti.fotoProduktit != foto.emriFotos ? (
                        <Button variant="primary" onClick={() => VendosFotoKryesore(foto.emriFotos)}>
                          Vendos Foton Kryesore
                        </Button>
                      ) : (
                        <Button variant="primary" disabled>
                          Eshte Foto Kryesore
                        </Button>
                      )}
                      <Button variant="danger" onClick={() => fshijFoton(foto.id, foto.emriFotos)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              props.largo();
              props.perditesoTeDhenat();
            }}
            disabled={loading}
          >
            Mbyll <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditoFototProduktit;
