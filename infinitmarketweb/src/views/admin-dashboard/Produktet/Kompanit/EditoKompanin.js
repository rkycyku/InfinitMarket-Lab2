import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import KontrolloAksesinNeFunksione from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione';

function EditoKompanin(props) {
  const [kompania, setKompania] = useState([]);
  
  const [perditeso, setPerditeso] = useState('');
  const [kompanit, setKompanite] = useState([]);
  const [kontrolloKompanine, setKontrolloKompanine] = useState(false);
  const [konfirmoKompanine, setKonfirmoKompanine] = useState(false);
  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  useEffect(() => {
    const vendosKompanite = async () => {
      try {
        const kompanit = await axios.get(`https://localhost:7251/api/Produktet/Kompania/shfaqKompanit`, authentikimi);
        setKompanite(kompanit.data);
      } catch (err) {
        console.log(err);
      }
    };

    vendosKompanite();
  }, [perditeso]);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const shfaqKompanit = async () => {
      try {
        const kompania = await axios.get(
          `https://localhost:7251/api/Produktet/Kompania/shfaqKompaninSipasIDs?id=${props.id}`,
          authentikimi
        );
        setKompania(kompania.data);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqKompanit();
  }, []);

  const handleEmriChange = (value) => {
    setKompania((prev) => ({ ...prev, emriKompanis: value }));
  };

  const handleAdresaChange = (value) => {
    setKompania((prev) => ({ ...prev, adresa: value }));
  };

  function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }

  async function handleSubmit() {
    await axios
      .put(
        `https://localhost:7251/api/Produktet/Kompania/perditesoKompanin?id=${kompania.kompaniaID}`,
        {
          emriKompanis: kompania.emriKompanis,
          adresa: kompania.adresa
        },
        authentikimi
      )
      .then((x) => {
        props.setTipiMesazhit('success');
        props.setPershkrimiMesazhit('Kompania u Perditesua me sukses!');
        props.perditesoTeDhenat();
        props.largo();
        props.shfaqmesazhin();
      })
      .catch((error) => {
        console.error('Error saving kompania:', error);
        props.setTipiMesazhit('danger');
        props.setPershkrimiMesazhit('Ndodhi nje gabim gjate perditesimit te kompanis!');
        props.perditesoTeDhenat();
        props.shfaqmesazhin();
      });
  }

  const handleKontrolli = () => {
    if (isNullOrEmpty(kompania.emriKompanis)) {
      setFushatEZbrazura(true);
    } else {
      if (konfirmoKompanine == false && kompanit.filter((item) => item.emriKompanis === kompania.emriKompanis).length !== 0) {
        setKontrolloKompanine(true);
      } else {
        handleSubmit();
      }
    }
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
      {kontrolloKompanine && (
        <Modal size="sm" show={kontrolloKompanine} onHide={() => setKontrolloKompanine(false)}>
          <Modal.Header closeButton>
            <Modal.Title as="h6">Konfirmo Perditesimin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span style={{ fontSize: '10pt' }}>Nje kompani me te njejtin emer ekziston ne sistem!</span>
            <br />
            <strong style={{ fontSize: '10pt' }}>A jeni te sigurt qe deshironi te vazhdoni?</strong>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={() => setKontrolloKompanine(false)}>
              Korrigjo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button
              size="sm"
              variant="warning"
              onClick={() => {
                handleSubmit();
              }}
            >
              Vazhdoni
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal className="modalEditShto" show={true} onHide={() => props.largo()}>
        <Modal.Header closeButton>
          <Modal.Title>Edito Kompanin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ID Kompanis</Form.Label>
              <Form.Control value={kompania.kompaniaID} disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Emri Kompanis<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                onChange={(e) => handleEmriChange(e.target.value)}
                value={kompania.emriKompanis}
                type="text"
                placeholder="Emri Kompanis"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Adresa Kompanis</Form.Label>
              <Form.Control
                onChange={(e) => handleAdresaChange(e.target.value)}
                type="text"
                placeholder="Adresa Kompanis"
                value={kompania.adresa}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.largo()}>
            Anulo <FontAwesomeIcon icon={faXmark} />
          </Button>
          <Button className="Butoni" onClick={handleKontrolli}>
            Edito Kompanin <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditoKompanin;
