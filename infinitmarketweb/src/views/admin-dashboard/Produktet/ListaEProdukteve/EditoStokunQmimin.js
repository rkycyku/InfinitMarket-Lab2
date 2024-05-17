import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import KontrolloAksesinNeFunksione from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione';

function EditoStokunQmimin(props) {
  const [produkti, setProdukti] = useState({
    emriProduktit: '',
    sasiaNeStok: '',
    qmimiBleres: '',
    qmimiProduktit: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stoku, setStoku] = useState(0);
  const [qmimiBleres, setQmimiBleres] = useState(0);
  const [qmimiProduktit, setQmimiProduktit] = useState(0);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const produkti = await axios.get(
          `https://localhost:7251/api/Produktet/Produkti/ShfaqProduktinSipasIDsAll/${props.id}`,
          authentikimi
        );

        setProdukti(produkti.data.produkti);
        setQmimiBleres(produkti.data.produkti.qmimiBleres);
        setQmimiProduktit(produkti.data.produkti.qmimiProduktit);
      } catch (error) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props.id]);

  const handleSubmit = async () => {
    await axios
      .put(
        `https://localhost:7251/api/Produktet/Produkti/PerditesoStokunQmimin?id=${props.id}&stoku=${stoku}&qmimiBleres=${qmimiBleres}&qmimiShites=${qmimiProduktit}`,
        {},
        authentikimi
      )
      .then((x) => {
        props.setTipiMesazhit('success');
        props.setPershkrimiMesazhit('Stoku dhe Qmimi i Produktit u Perditesuan me sukses!');
        props.perditesoTeDhenat();
        props.largo();
        props.shfaqmesazhin();
      })
      .catch((error) => {
        console.error('Error saving the product:', error);
        props.setTipiMesazhit('danger');
        props.setPershkrimiMesazhit('Ndodhi nje gabim gjate perditesimit te produktit!');
        props.perditesoTeDhenat();
        props.shfaqmesazhin();
      });
  };

  return (
    <>
      <KontrolloAksesinNeFunksione
        largo={() => props.largo()}
        shfaqmesazhin={() => props.shfaqmesazhin()}
        perditesoTeDhenat={() => props.perditesoTeDhenat()}
        setTipiMesazhit={(e) => props.setTipiMesazhit(e)}
        setPershkrimiMesazhit={(e) => props.setPershkrimiMesazhit(e)}
      />
      <Modal show={true} onHide={props.largo}>
        <Modal.Header closeButton>
          <Modal.Title>Perditeso Stokun dhe Qmimin e Produktit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="emriProduktit">
              <Form.Label>Emri Produktit</Form.Label>
              <Form.Control type="text" name="emriProduktit" value={produkti.emriProduktit} disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="sasiaNeStok">
              <Form.Label>
                Shtoni Sasine ne Stok: <span style={{ fontWeight: 'bold' }}>Sasia Aktuale {produkti.sasiaNeStok}</span>
              </Form.Label>
              <Form.Control type="number" name="sasiaNeStok" value={stoku} onChange={(e) => setStoku(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="qmimiBleres">
              <Form.Label>
                Perditesoni Çmimi Blerës:{' '}
                <span style={{ fontWeight: 'bold' }}>Çmimi Aktual {parseFloat(produkti.qmimiBleres).toFixed(2)} €</span>{' '}
              </Form.Label>
              <Form.Control type="number" name="qmimiBleres" value={qmimiBleres} onChange={(e) => setQmimiBleres(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="qmimiProduktit">
              <Form.Label>
                Perditesoni Çmimi Produktit:{' '}
                <span style={{ fontWeight: 'bold' }}>Çmimi Aktual {parseFloat(produkti.qmimiProduktit).toFixed(2)} €</span>{' '}
              </Form.Label>
              <Form.Control
                type="number"
                name="qmimiProduktit"
                value={qmimiProduktit}
                onChange={(e) => setQmimiProduktit(e.target.value)}
              />
            </Form.Group>
          </Form>
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
    </>
  );
}

export default EditoStokunQmimin;
