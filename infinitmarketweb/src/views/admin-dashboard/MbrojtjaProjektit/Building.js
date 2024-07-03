import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPenToSquare, faPlus, faClose, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Tabela from '../../../components/Tabela/Tabela';

function Building() {
  const [Building, setBuilding] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shto, setShto] = useState(false);
  const [edito, setEdito] = useState(false);
  const [fshij, setFshij] = useState(false);
  const [id, setId] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const shfaqBuilding = async () => {
      try {
        const Building = await axios.get('https://localhost:7251/api/MbrojtjaEProjektit/Building/ShfaqBuilding');
        setBuilding(
          Building.data.map((k) => ({
            ID: k.buildingID,
            Name: k.name,
            Location: k.location
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };

    shfaqBuilding();
  }, [perditeso]);

  // SHTO
  const [name, setName] = useState('');
  const handleNameChange = (value) => {
    setName(value);
  };
  const [location, setLocation] = useState('');
  const handleLocationChange = (value) => {
    setLocation(value);
  };
  // SHTO

  // Edito
  const [Buildingi, setBuildingi] = useState([]);

  const handleName = (value) => {
    setBuildingi((prev) => ({ ...prev, name: value }));
  };

  const handleLocation = (value) => {
    setBuildingi((prev) => ({ ...prev, location: value }));
  };

  useEffect(() => {
    const vendosTeDhenat = async () => {
      try {
        const teDhenatBuildingi = await axios.get(
          `https://localhost:7251/api/MbrojtjaEProjektit/Building/ShfaqBuildingNgaID?BuildingId=${id}`
        );
        setBuildingi(teDhenatBuildingi.data);
      } catch (e) {
        console.error(e);
      }
    };

    vendosTeDhenat();
  }, [edito]);
  // Edito

  const handleShow = () => setShto(true);

  const handleEdito = (id) => {
    setEdito(true);
    setId(id);
  };

  const handleFshij = (id) => {
    setFshij(true);
    setId(id);
  };

  const handleShtoBuildingin = async () => {
    await axios
      .post('https://localhost:7251/api/MbrojtjaEProjektit/Building/ShtoBuilding', {
        name: name,
        location: location
      })
      .then(() => {
        setShto(false);
        setName('');
        setLocation('');
        setPerditeso(Date.now());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handlePerditesoBuildingin = async () => {
    await axios
      .put(`https://localhost:7251/api/MbrojtjaEProjektit/Building/PerditesoBuilding?BuildingId=${id}`, Buildingi)
      .then(() => {
        setEdito(false);
        setPerditeso(Date.now());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleFshijBuildingin = async () => {
    await axios
      .delete(`https://localhost:7251/api/MbrojtjaEProjektit/Building/FshijBuilding?BuildingId=${id}`)
      .then(() => {
        setFshij(false);
        setPerditeso(Date.now());
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      {shto && (
        <Modal className="modalEditShto" show={shto} onHide={() => setShto(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Shto Building</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>
                  Name<span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  onChange={(e) => handleNameChange(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Name"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>
                  Location<span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  onChange={(e) => handleLocationChange(e.target.value)}
                  value={location}
                  type="text"
                  placeholder="Location"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShto(false)}>
              Close <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button style={{ backgroundColor: '#009879', border: 'none' }} onClick={handleShtoBuildingin}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {edito && (
        <Modal className="modalEditShto" show={edito} onHide={() => setEdito(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edito Buildingin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>ID Building</Form.Label>
                <Form.Control type="text" value={Buildingi.buildingID} disabled />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={(e) => handleName(e.target.value)}
                  value={Buildingi.name}
                  type="text"
                  placeholder="Name"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  onChange={(e) => handleLocation(e.target.value)}
                  value={Buildingi.location}
                  type="text"
                  placeholder="Location"
                  autoFocus
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEdito(false)}>
              Anulo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button style={{ backgroundColor: '#009879', border: 'none' }} onClick={handlePerditesoBuildingin}>
              Edito Building <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {fshij && (
        <Modal show={fshij} onHide={() => setFshij(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'red' }}>Largo Buildingin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>A jeni te sigurt qe deshironi ta fshini kete Building?</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setFshij(false)}>
              Anulo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button variant="danger" onClick={handleFshijBuildingin}>
              Largo Buildingin <FontAwesomeIcon icon={faBan} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <>
        <>
          <Tabela
            data={Building}
            tableName="Lista e Building"
            kaButona
            funksionButonShto={() => handleShow()}
            funksionButonEdit={(e) => handleEdito(e)}
            funksionButonFshij={(e) => handleFshij(e)}
          />
        </>
      </>
    </div>
  );
}

export default Building;
