import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import KontrolloAksesinNeFunksione from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione';

function EditoRenovation(props) {
  const [renovation, setRenovation] = useState([]);

  const [building, setBuilding] = useState([]);

  const [perditeso, setPerditeso] = useState('');
  const [renovations, setRenovations] = useState([]);
  const [kontrolloRenovation, setKontrolloRenovation] = useState(false);
  const [konfirmoRenovation, setKonfirmoRenovation] = useState(false);
  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const vendosRenovations = async () => {
      try {
        const renovations = await axios.get(`https://localhost:7251/api/MbrojtjaEProjektit/Renovation/ShfaqRenovation`, authentikimi);
        setRenovations(renovations.data);
        const building = await axios.get('https://localhost:7251/api/MbrojtjaEProjektit/Building/ShfaqBuilding', authentikimi);
        setBuilding(building.data);
      } catch (err) {
        console.log(err);
      }
    };

    vendosRenovations();
  }, [perditeso]);

  useEffect(() => {
    const shfaqRenovation = async () => {
      try {
        const renovationKerkim = await axios.get(
          `https://localhost:7251/api/MbrojtjaEProjektit/Renovation/ShfaqRenovationNgaID?RenovationID=${props.id}`,
          authentikimi
        );
        setRenovation(renovationKerkim.data);

        console.log(renovation);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqRenovation();
  }, []);

  const handleChange = (propertyName) => (event) => {
    setRenovation((prev) => ({
      ...prev,
      [propertyName]: event.target.value
    }));

    console.log(renovation);
  };

  const handleBuildingChange = (event) => {
    setRenovation((prev) => ({ ...prev, buildingID: event }));
  };

  function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }

  function handleSubmit() {
    axios
      .put(
        `https://localhost:7251/api/MbrojtjaEProjektit/Renovation/PerditesoRenovation?RenovationID=${renovation.renovationID}`,
        renovation,
        authentikimi
      )
      .then((x) => {
        props.setTipiMesazhit('success');
        props.setPershkrimiMesazhit('Renovation u Perditesua me sukses!');
        props.perditesoTeDhenat();
        props.largo();
        props.shfaqmesazhin();
      })
      .catch((error) => {
        console.error('Error:', error);
        props.setTipiMesazhit('danger');
        props.setPershkrimiMesazhit('Ndodhi nje gabim gjate perditesimit te renovation!');
        props.perditesoTeDhenat();
        props.shfaqmesazhin();
      });
  }

  const handleKontrolli = () => {
    if (renovation.cost < 0 || isNullOrEmpty(renovation.description) || isNullOrEmpty(renovation.buildingID)) {
      setFushatEZbrazura(true);
    } else {
      if (
        konfirmoRenovation == false &&
        renovations.filter(
          (item) => item.cost === renovation.cost && item.description == renovation.description && item.buildingID == renovation.buildingID
        ).length !== 0
      ) {
        setKontrolloRenovation(true);
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
      {kontrolloRenovation && (
        <Modal size="sm" show={kontrolloRenovation} onHide={() => setKontrolloRenovation(false)}>
          <Modal.Header closeButton>
            <Modal.Title as="h6">Konfirmo vendosjen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span style={{ fontSize: '10pt' }}>Ky Renovation ekziston ne sistem!</span>
            <br />
            <strong style={{ fontSize: '10pt' }}>A jeni te sigurt qe deshironi te vazhdoni?</strong>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={() => setKontrolloRenovation(false)}>
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
          <Modal.Title>Edito Renovation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Renovation ID</Form.Label>
              <Form.Control value={renovation.renovationID} disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Description<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                onChange={handleChange('description')}
                value={renovation.description}
                type="text"
                placeholder="Description"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Cost<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control onChange={handleChange('cost')} value={renovation.cost} type="text" placeholder="Cost" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Building</Form.Label>
              <select
                placeholder="Building"
                className="form-select"
                value={renovation.buildingID}
                onChange={(e) => handleBuildingChange(e.target.value)}
              >
                <option selected disabled hidden>
                  {renovation.building && renovation.building.name} - {renovation.building && renovation.building.location}
                </option>
                {building &&
                  building.map((item) => {
                    return (
                      <option key={item.buildingID} value={item.buildingID}>
                        {item.name} - {item.location}
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
            Edito Renovation <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditoRenovation;
