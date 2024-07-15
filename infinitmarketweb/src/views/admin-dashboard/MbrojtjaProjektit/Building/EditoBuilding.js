import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import KontrolloAksesinNeFunksione from '../../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione';

function EditoBuilding(props) {
  const [building, setBuilding] = useState([]);

  const [perditeso, setPerditeso] = useState('');
  const [buildings, setBuildings] = useState([]);
  const [kontrolloBuilding, setKontrolloBuilding] = useState(false);
  const [konfirmoBuilding, setKonfirmoBuilding] = useState(false);
  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const vendosBuildings = async () => {
      try {
        const buildings = await axios.get(`https://localhost:7251/api/MbrojtjaEProjektit/Building/ShfaqBuilding`, authentikimi);
        setBuildings(buildings.data);
      } catch (err) {
        console.log(err);
      }
    };

    vendosBuildings();
  }, [perditeso]);

  useEffect(() => {
    const shfaqBuilding = async () => {
      try {
        const buildingKerkim = await axios.get(
          `https://localhost:7251/api/MbrojtjaEProjektit/Building/ShfaqBuildingNgaID?BuildingId=${props.id}`,
          authentikimi
        );
        setBuilding(buildingKerkim.data);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqBuilding();
  }, []);

  const handleChange = (propertyName) => (event) => {
    setBuilding((prev) => ({
      ...prev,
      [propertyName]: event.target.value
    }));
  };

  function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }

  function handleSubmit() {
    axios
      .put(
        `https://localhost:7251/api/MbrojtjaEProjektit/Building/PerditesoBuilding?BuildingId=${building.buildingID}`,
        building,
        authentikimi
      )
      .then((x) => {
        props.setTipiMesazhit('success');
        props.setPershkrimiMesazhit('Building u Perditesua me sukses!');
        props.perditesoTeDhenat();
        props.largo();
        props.shfaqmesazhin();
      })
      .catch((error) => {
        console.error('Error:', error);
        props.setTipiMesazhit('danger');
        props.setPershkrimiMesazhit('Ndodhi nje gabim gjate perditesimit te building!');
        props.perditesoTeDhenat();
        props.shfaqmesazhin();
      });
  }

  const handleKontrolli = () => {
    if (isNullOrEmpty(building.name) || isNullOrEmpty(building.location)) {
      setFushatEZbrazura(true);
    } else {
      if (
        konfirmoBuilding == false &&
        buildings.filter((item) => item.name == building.name && item.location == building.location).length !== 0
      ) {
        setKontrolloBuilding(true);
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
      {kontrolloBuilding && (
        <Modal size="sm" show={kontrolloBuilding} onHide={() => setKontrolloBuilding(false)}>
          <Modal.Header closeButton>
            <Modal.Title as="h6">Konfirmo vendosjen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span style={{ fontSize: '10pt' }}>Ky Building ekziston ne sistem!</span>
            <br />
            <strong style={{ fontSize: '10pt' }}>A jeni te sigurt qe deshironi te vazhdoni?</strong>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={() => setKontrolloBuilding(false)}>
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
          <Modal.Title>Edito Building</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Building ID</Form.Label>
              <Form.Control value={building.buildingID} disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Emri<span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control onChange={handleChange('name')} value={building.name} type="text" placeholder="Emri" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Lokacioni<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control onChange={handleChange('location')} value={building.location} as="textarea" placeholder="Lokacioni" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.largo()}>
            Anulo <FontAwesomeIcon icon={faXmark} />
          </Button>
          <Button className="Butoni" onClick={handleKontrolli}>
            Edito Building <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditoBuilding;
