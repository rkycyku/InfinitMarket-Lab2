import { React, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBan, faL } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

const ShtoProduktin = (props) => {
  const [perditeso, setPerditeso] = useState('');
  const [emriProduktit, setEmriProduktit] = useState('');
  const [pershkrimi, setPershkrimi] = useState('');
  const [sasiaNeStok, setSasiaNeStok] = useState(0);
  const [qmimiBleres, setQmimiBleres] = useState(0);
  const [qmimiProduktit, setQmimiProduktit] = useState(0);
  const [kategoriaId, setKategoriaId] = useState('');
  const [kompaniaId, setKompaniaId] = useState('');
  const [foto, setFoto] = useState(null);

  const [produktet, setProduktet] = useState([]);
  const [kompanit, setKompanit] = useState([]);
  const [kategoria, setKategoria] = useState([]);
  const [kontrolloProduktin, setKontrolloProduktin] = useState(false);
  const [konfirmoProduktin, setKonfirmoProduktin] = useState(false);
  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  useEffect(() => {
    const vendosProduktet = async () => {
      try {
        const produktet = await axios.get(`https://localhost:7251/api/Produktet/Produkti/ShfaqProduktet`, authentikimi);
        const shfaqKompanit = await axios.get(`https://localhost:7251/api/Produktet/Kompania/shfaqKompanit`, authentikimi);
        const shfaqKategorit = await axios.get(`https://localhost:7251/api/Produktet/Kategoria/shfaqKategorit`, authentikimi);

        setKompanit(shfaqKompanit.data);
        setKategoria(shfaqKategorit.data);
        setProduktet(produktet.data);
      } catch (err) {
        console.log(err);
      }
    };

    vendosProduktet();
  }, [perditeso]);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  const handleFotoChange = (event) => {
    setFoto(event.target.files[0]);
  };

  async function handleSubmit() {
    if (foto) {
      const formData = new FormData();
      formData.append('foto', foto);

      try {
        await axios
          .post('https://localhost:7251/api/TeNdryshme/VendosFotot/ShtoProduktin', formData, authentikimi)
          .then(async (response) => {
            await axios
              .post(
                'https://localhost:7251/api/Produktet/Produkti/ShtoProdukt',
                {
                  emriProduktit: emriProduktit,
                  pershkrimi: pershkrimi,
                  fotoProduktit: response.data,
                  kompaniaId: kompaniaId,
                  kategoriaId: kategoriaId,
                  teDhenatProduktit: {
                    sasiaNeStok: sasiaNeStok,
                    qmimiBleres: qmimiBleres,
                    qmimiProduktit: qmimiProduktit
                  }
                },
                authentikimi
              )
              .then(async (response) => {
                props.setTipiMesazhit('success');
                props.setPershkrimiMesazhit('Produkti u insertua me sukses!');
                props.perditesoTeDhenat();
                props.largo();
                props.shfaqmesazhin();
              })
              .catch((error) => {
                console.log(error);
              });
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      await axios
        .post(
          'https://localhost:7251/api/Produktet/Produkti/ShtoProdukt',
          {
            emriProduktit: emriProduktit,
            pershkrimi: pershkrimi,
            fotoProduktit: 'ProduktPaFoto.png',
            kompaniaId: kompaniaId,
            kategoriaId: kategoriaId,
            teDhenatProduktit: {
              sasiaNeStok: sasiaNeStok,
              qmimiBleres: qmimiBleres,
              qmimiProduktit: qmimiProduktit
            }
          },
          authentikimi
        )
        .then((response) => {
          props.setTipiMesazhit('success');
          props.setPershkrimiMesazhit('Produkti u insertua me sukses!');
          props.perditesoTeDhenat();
          props.largo();
          props.shfaqmesazhin();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }

  const handleKontrolli = () => {
    if (isNullOrEmpty(emriProduktit) || isNullOrEmpty(kompaniaId) || isNullOrEmpty(kategoriaId)) {
      setFushatEZbrazura(true);
    } else {
      if (konfirmoProduktin == false && produktet.filter((item) => item.emriProduktit === emriProduktit).length !== 0) {
        setKontrolloProduktin(true);
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <>
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
      {kontrolloProduktin && (
        <Modal size="sm" show={kontrolloProduktin} onHide={() => setKontrolloProduktin(false)}>
          <Modal.Header closeButton>
            <Modal.Title as="h6">Konfirmo vendosjen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span style={{ fontSize: '10pt' }}>Nje produkt me te njejtin emer ekziston ne sistem!</span>
            <br />
            <strong style={{ fontSize: '10pt' }}>A jeni te sigurt qe deshironi te vazhdoni?</strong>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={() => setKontrolloProduktin(false)}>
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
      <Modal className="modalEditShto" show={props.shfaq} onHide={props.largo}>
        <Modal.Header closeButton>
          <Modal.Title>Shto Produkt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="emriProduktit">
              <Form.Label>Emri Produktit</Form.Label>
              <Form.Control
                type="text"
                placeholder="Emri Produktit"
                value={emriProduktit}
                onChange={(e) => setEmriProduktit(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="pershkrimi">
              <Form.Label>Pershkrimi</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Pershkrimi"
                value={pershkrimi}
                onChange={(e) => setPershkrimi(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="sasiaNeStok">
              <Form.Label>Sasia në Stok</Form.Label>
              <Form.Control
                type="number"
                placeholder="Sasia në Stok"
                value={sasiaNeStok}
                onChange={(e) => setSasiaNeStok(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="qmimiBleres">
              <Form.Label>Qmimi Blerës</Form.Label>
              <Form.Control
                type="number"
                placeholder="Qmimi Blerës"
                value={qmimiBleres}
                onChange={(e) => setQmimiBleres(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="qmimiProduktit">
              <Form.Label>Qmimi Produktit</Form.Label>
              <Form.Control
                type="number"
                placeholder="Qmimi Produktit"
                value={qmimiProduktit}
                onChange={(e) => setQmimiProduktit(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Foto Produktit</Form.Label>
              <Form.Control type="file" accept="image/*" placeholder="Foto e Produktit" onChange={handleFotoChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>
                Kompania<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                placeholder="Kompania e Produktit"
                className="form-select"
                value={kompaniaId}
                onChange={(e) => setKompaniaId(e.target.value)}
              >
                <option defaultValue disabled value="">
                  Kompania e Produktit
                </option>
                {kompanit.map((item) => {
                  return (
                    <option key={item.kompaniaID} value={item.kompaniaID}>
                      {item.emriKompanis}
                    </option>
                  );
                })}
              </select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>
                Kategoria<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select
                placeholder="Kategoria e Produktit"
                className="form-select"
                value={kategoriaId}
                onChange={(e) => setKategoriaId(e.target.value)}
              >
                <option defaultValue disabled value="">
                  Kategoria e Produktit
                </option>
                {kategoria.map((item) => {
                  return (
                    <option key={item.kategoriaId} value={item.kategoriaId}>
                      {item.llojiKategoris}
                    </option>
                  );
                })}
              </select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.largo}>
            Close <FontAwesomeIcon icon={faXmark} />
          </Button>
          <Button style={{ backgroundColor: '#009879', border: 'none' }} onClick={handleKontrolli}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ShtoProduktin;
