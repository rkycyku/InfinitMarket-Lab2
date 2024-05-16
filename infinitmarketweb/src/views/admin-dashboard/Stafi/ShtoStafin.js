import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import KontrolloAksesinNeFunksione from '../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione';

function ShtoStafin(props) {
  const [emri, setEmri] = useState('');
  const [mbiemri, setMbiemri] = useState('');
  const [email, setEmail] = useState('');
  const [roli, setRoli] = useState('');

  const [perditeso, setPerditeso] = useState('');
  const [rolet, setRolet] = useState([]);

  const [kontrolloEmail, setKontrolloEmail] = useState(false);
  const [konfirmoEmail, setKonfrimoEmail] = useState(false);
  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  useEffect(() => {
    const vendosRolet = async () => {
      try {
        const rolet = await axios.get(`https://localhost:7251/api/Perdoruesi/Stafi/shfaqRolet`, authentikimi);
        setRolet(rolet.data.filter((item) => item.name != 'Klient'));
      } catch (err) {
        console.log(err);
      }
    };

    vendosRolet();
  }, [perditeso]);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }

  async function handleSubmit() {
    axios
      .post(
        'https://localhost:7251/api/Perdoruesi/Stafi/RegjistroStafin',
        {
          emri: emri,
          mbiemri: mbiemri,
          email: email,
          roliZgjedhur: roli
        },
        authentikimi
      )
      .then((response) => {
        props.setTipiMesazhit('success');
        if (kontrolloEmail === true) {
          props.setPershkrimiMesazhit(`
          <p><span>U shtua roli:  ${response.data.roli} per ${response.data.email}</span></p>
        `);
        } else {
          props.setPershkrimiMesazhit(`
          <p><span>Llogaria e stafit u krijua me sukses, keto jane te dhenat per hyrje:</span></p>
          <p><span>Email:</span> ${response.data.email}</p>
          <p><span>Password:</span> ${response.data.password}</p>
          <p><span>Aksesi:</span> ${response.data.aksesi}</p>
        `);
        }

        props.perditesoTeDhenat();
        props.largo();
        props.shfaqmesazhin();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleKontrolli = async () => {
    if (isNullOrEmpty(emri) || isNullOrEmpty(mbiemri) || isNullOrEmpty(email)) {
      setFushatEZbrazura(true);
    } else {
      const kontrolloEmail = await axios.get(
        `https://localhost:7251/api/Perdoruesi/Stafi/KontrolloPerdoruesin?email=${email}`,
        authentikimi
      );
      console.log(kontrolloEmail);
      if (kontrolloEmail.data === true) {
        setKontrolloEmail(true);
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
      {kontrolloEmail && (
        <Modal size="sm" show={kontrolloEmail} onHide={() => setKontrolloEmail(false)}>
          <Modal.Header closeButton>
            <Modal.Title as="h6">Konfirmo Emailin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span style={{ fontSize: '10pt' }}>Ky email ekziston ne sistem!</span>
            <br />
            <strong style={{ fontSize: '10pt' }}>Vetem roli i zgjdhur do te perditesohet!</strong>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={() => setKontrolloEmail(false)}>
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
      <Modal className="modalEditShto" show={props.shfaq} onHide={() => props.largo()}>
        <Modal.Header closeButton>
          <Modal.Title>Shtoni Stafin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Emri<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control onChange={(e) => setEmri(e.target.value)} value={emri} type="text" placeholder="Emri" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Mbiemri<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control onChange={(e) => setMbiemri(e.target.value)} value={mbiemri} type="text" placeholder="Mbiemri" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Email<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>
                Roli<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <select placeholder="Kompania e Produktit" className="form-select" value={roli} onChange={(e) => setRoli(e.target.value)}>
                <option defaultValue disabled value="">
                  Rolet
                </option>
                {rolet.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.largo()}>
            Anulo <FontAwesomeIcon icon={faXmark} />
          </Button>
          <Button className="Butoni" onClick={handleKontrolli}>
            Shto Stafin <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShtoStafin;
