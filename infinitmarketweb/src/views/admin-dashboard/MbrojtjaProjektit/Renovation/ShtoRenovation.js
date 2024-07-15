import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import KontrolloAksesinNeFunksione from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione';

function ShtoRenovation(props) {
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [buildingID, setBuildingID] = useState('');

  const [building, setBuilding] = useState([]);

  const [perditeso, setPerditeso] = useState('');
  const [renovation, setRenovation] = useState([]);
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
    const vendosRenovation = async () => {
      try {
        const renovation = await axios.get(`https://localhost:7251/api/MbrojtjaEProjektit/Renovation/ShfaqRenovation`, authentikimi);
        setRenovation(renovation.data);
        const building = await axios.get('https://localhost:7251/api/MbrojtjaEProjektit/Building/ShfaqBuilding', authentikimi);
        setBuilding(building.data);
      } catch (err) {
        console.log(err);
      }
    };

    vendosRenovation();
  }, [perditeso]);

  const handleChange = (setState) => (event) => {
    setState(event.target.value);
  };

  const handleBuildingChange = (event) => {
    setBuildingID(event);
  };

  function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }

  function handleSubmit() {
    axios
      .post(
        'https://localhost:7251/api/MbrojtjaEProjektit/Renovation/ShtoRenovation',
        {
          description: description,
          cost: cost,
          buildingID: buildingID
        },
        authentikimi
      )
      .then((response) => {
        props.setTipiMesazhit('success');
        props.setPershkrimiMesazhit('Renovation u insertua me sukses!');
        props.perditesoTeDhenat();
        props.largo();
        props.shfaqmesazhin();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleKontrolli = () => {
    if (isNullOrEmpty(description) || cost < 0 || isNullOrEmpty(buildingID)) {
      setFushatEZbrazura(true);
    } else {
      if (
        konfirmoRenovation == false &&
        renovation.filter((item) => item.description === description && item.cost == cost && item.buildingID == buildingID).length !== 0
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
      <Modal className="modalEditShto" show={props.shfaq} onHide={() => props.largo()}>
        <Modal.Header closeButton>
          <Modal.Title>Shto Renovation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Description<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control onChange={handleChange(setDescription)} value={description} type="text" placeholder="Description" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Cost<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control onChange={handleChange(setCost)} value={cost} type="text" placeholder="Cost" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Building</Form.Label>
              <select
                placeholder="Building"
                className="form-select"
                value={buildingID}
                onChange={(e) => handleBuildingChange(e.target.value)}
              >
                <option defaultValue disabled value="">
                  Zgjedhni Ndertesen
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
            Shto Renovation <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShtoRenovation;
